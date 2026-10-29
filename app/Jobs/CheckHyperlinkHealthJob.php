<?php

namespace App\Jobs;

use App\Console\Commands\PingHyperlinksCommand;
use App\Enums\Health;
use App\Mail\UnhealthyHyperlinkMail;
use App\Models\Hyperlink;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class CheckHyperlinkHealthJob implements ShouldQueue
{
    use Queueable;

    public function __construct(public Hyperlink $hyperlink) {}

    public function handle(): void
    {
        $result = (new PingHyperlinksCommand)->checkDestinationHealth($this->hyperlink->url);

        $health = match ($result['health']) {
            'Healthy' => Health::Healthy,
            'Unreachable' => Health::Unreachable,
            default => Health::Unhealthy,
        };

        $this->hyperlink->update(['health' => $health]);

        if ($health === Health::Unhealthy && $this->hyperlink->user) {
            Mail::to($this->hyperlink->user)->queue(new UnhealthyHyperlinkMail($this->hyperlink));
        }
    }
}
