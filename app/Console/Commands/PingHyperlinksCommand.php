<?php

namespace App\Console\Commands;

use App\Enums\Health;
use App\Enums\Plan;
use App\Mail\UnhealthyHyperlinkMail;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Throwable;

class PingHyperlinksCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'hyperlinks:ping
                            {tier? : The subscription tier to filter by (Free, Redirect, Redirect Plus, or All)}
                            {--tier= : The subscription tier to filter by (Free, Redirect, Redirect Plus, or All)}
                            {--timeout=10 : HTTP request timeout in seconds}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ping destination URLs of hyperlinks for users belonging to a specific subscription tier to check their health';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $tierInput = $this->option('tier') ?: $this->argument('tier');

        if ($tierInput !== null && ! $this->isValidTierInput((string) $tierInput)) {
            $this->error("Invalid subscription tier [$tierInput]. Valid tiers are: Free, Redirect, Redirect Plus, or All.");

            return self::FAILURE;
        }

        $targetPlan = $tierInput !== null ? $this->resolvePlan((string) $tierInput) : null;
        $tierLabel = $targetPlan ? $targetPlan->value : 'All';

        $this->info("Fetching users and hyperlinks for subscription tier: $tierLabel");

        $timeout = max(1, (int) ($this->option('timeout') ?: 10));

        $users = User::with(['hyperlinks', 'subscriptions.items'])->get();

        $matchingUsers = $users->filter(function (User $user) use ($targetPlan) {
            if ($targetPlan === null) {
                return true;
            }

            return $user->currentPlan() === $targetPlan;
        });

        if ($matchingUsers->isEmpty()) {
            $this->warn("No users found for subscription tier: $tierLabel");

            return self::SUCCESS;
        }

        $totalLinks = 0;
        $healthyCount = 0;
        $unreachableCount = 0;
        $unhealthyCount = 0;
        $rows = [];

        foreach ($matchingUsers as $user) {
            $userPlan = $user->currentPlan()->value;
            $userIdentifier = $user->email ?? $user->name ?? (string) $user->id;

            if ($user->hyperlinks->isEmpty()) {
                continue;
            }

            foreach ($user->hyperlinks as $hyperlink) {
                $totalLinks++;
                $health = $this->checkDestinationHealth($hyperlink->url, $timeout);

                $healthEnum = match ($health['health']) {
                    'Healthy' => Health::Healthy,
                    'Unreachable' => Health::Unreachable,
                    default => Health::Unhealthy,
                };

                $hyperlink->update([
                    'health' => $healthEnum,
                ]);

                if ($health['health'] === 'Healthy') {
                    $healthyCount++;
                } elseif ($health['health'] === 'Unreachable') {
                    $unreachableCount++;
                } else {
                    $unhealthyCount++;
                    Mail::to($user)->queue(new UnhealthyHyperlinkMail($hyperlink));
                }

                $statusLabel = strtoupper($health['health']);

                $this->line(sprintf(
                    '[%s] User: %s | Plan: %s | Slug: %s | URL: %s | Status: %s (%s)',
                    $statusLabel,
                    $userIdentifier,
                    $userPlan,
                    $hyperlink->shot_slug,
                    $hyperlink->url,
                    $health['status'],
                    $health['details']
                ));

                $rows[] = [
                    'User' => $userIdentifier,
                    'Tier' => $userPlan,
                    'Slug' => $hyperlink->shot_slug,
                    'URL' => $hyperlink->url,
                    'Status' => $health['status'],
                    'Health' => $health['health'],
                    'Details' => $health['details'],
                ];
            }
        }

        if ($totalLinks > 0 && ! empty($rows)) {
            $this->newLine();
            $this->table(
                ['User', 'Tier', 'Slug', 'URL', 'Status', 'Health', 'Details'],
                $rows
            );
        }

        $this->newLine();
        $this->info("Summary for subscription tier [$tierLabel]:");
        $this->line("Users checked: {$matchingUsers->count()}");
        $this->line("Total hyperlinks pinged: $totalLinks");
        $this->line("Healthy destinations: <info>$healthyCount</info>");
        $this->line('Unreachable destinations: ' . ($unreachableCount > 0 ? "<comment>$unreachableCount</comment>" : '0'));
        $this->line('Unhealthy destinations: ' . ($unhealthyCount > 0 ? "<error>$unhealthyCount</error>" : '0'));

        return self::SUCCESS;
    }

    /**
     * Check if the destination URL is healthy / reachable by pinging it with an HTTP GET request.
     *
     * @return array{health: string, healthy: bool, status: string, details: string}
     */
    public function checkDestinationHealth(string $url, int $timeout = 10): array
    {
        try {
            $startTime = microtime(true);
            $response = Http::timeout($timeout)->connectTimeout(min(5, $timeout))->get($url);
            $durationMs = round((microtime(true) - $startTime) * 1000);
            $statusCode = $response->status();

            if ($statusCode >= 200 && $statusCode < 400) {
                $health = 'Healthy';
            } elseif ($statusCode >= 400 && $statusCode < 500) {
                $health = 'Unreachable';
            } else {
                $health = 'Unhealthy';
            }

            return [
                'health' => $health,
                'healthy' => $health === 'Healthy',
                'status' => (string) $statusCode,
                'details' => sprintf('%dms %s', $durationMs, $response->reason() ?: ($health === 'Healthy' ? 'OK' : 'Error')),
            ];
        } catch (Throwable $e) {
            return [
                'health' => 'Unhealthy',
                'healthy' => 'false',
                'status' => 'FAILED',
                'details' => $e->getMessage(),
            ];
        }
    }

    /**
     * Resolve the Plan enum from input string.
     */
    public function resolvePlan(string $input): ?Plan
    {
        $normalized = strtolower(trim($input));

        if ($normalized === 'all' || $normalized === '') {
            return null;
        }

        return match ($normalized) {
            'free' => Plan::Free,
            'redirect' => Plan::Redirect,
            'redirect plus', 'redirect-plus', 'redirect_plus', 'redirectPlus', 'redirectplus' => Plan::RedirectPlus,
            default => null,
        };
    }

    /**
     * Determine if the input tier string is valid.
     */
    public function isValidTierInput(string $input): bool
    {
        $normalized = strtolower(trim($input));

        if ($normalized === 'all' || $normalized === '') {
            return true;
        }

        return $this->resolvePlan($input) !== null;
    }
}
