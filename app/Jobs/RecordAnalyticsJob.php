<?php

namespace App\Jobs;

use App\Models\Analytic;
use App\Models\Hyperlink;
use App\Services\AnalyticsService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Http\Request;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Throwable;

class RecordAnalyticsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Serialized request metadata.
     *
     * @var array<string, mixed>
     */
    public array $requestData;

    /**
     * Create a new job instance.
     *
     * @param  array<string, mixed>|Request  $requestData
     */
    public function __construct(
        public Hyperlink|string $hyperlink,
        array|Request $requestData = [],
        public Analytic|int|null $analytic = null,
    ) {
        $this->requestData = $requestData instanceof Request
            ? AnalyticsService::snapshotRequest($requestData)
            : $requestData;
    }

    /**
     * Execute the job.
     */
    public function handle(AnalyticsService $analyticsService): ?Analytic
    {
        try {
            $hyperlink = $this->hyperlink instanceof Hyperlink
                ? $this->hyperlink
                : Hyperlink::query()->find($this->hyperlink);

            if (! $hyperlink) {
                return null;
            }

            $extracted = $analyticsService->extractData($this->requestData);

            if ($this->analytic) {
                $analytic = $this->analytic instanceof Analytic
                    ? $this->analytic
                    : Analytic::query()->find($this->analytic);

                if ($analytic) {
                    $analytic->update($extracted);

                    return $analytic;
                }
            }

            $extracted['hyperlink_id'] = $hyperlink->id;

            return $hyperlink->analytics()->create($extracted);
        } catch (Throwable $e) {
            report($e);

            return null;
        }
    }
}
