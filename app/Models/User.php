<?php

namespace App\Models;

use App\Enums\Plan;
use App\Support\Plans;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Paddle\Billable;
use Laravel\Paddle\Subscription;

class User extends Authenticatable implements MustVerifyEmail
{
    use Billable, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'access_token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Determine if the user has an active or valid subscription.
     */
    public function isSubscribed(): bool
    {
        return $this->subscribed();
    }

    /**
     * Determine if the user is subscribed to the Redirect tier (or higher).
     */
    public function subscribedToRedirect(): bool
    {
        return $this->subscribedToPrice([
            Plans::REDIRECT_MONTHLY,
            Plans::REDIRECT_ANNUAL,
            Plans::REDIRECT_PLUS_MONTHLY,
            Plans::REDIRECT_PLUS_ANNUAL,
        ]);
    }

    /**
     * Determine if the user is subscribed specifically to the Redirect Plus tier.
     */
    public function subscribedToRedirectPlus(): bool
    {
        return $this->subscribedToPrice([
            Plans::REDIRECT_PLUS_MONTHLY,
            Plans::REDIRECT_PLUS_ANNUAL,
        ]);
    }

    /**
     * Maximum number of logos allowed: 0 (none), 1 (Redirect), or null (unlimited, Redirect Plus).
     */
    public function logoLimit(): ?int
    {
        return $this->currentPlan()->logoLimit();
    }

    public function apiDailyLimit(): int
    {
        return $this->currentPlan()->apiDailyLimit();
    }

    public function currentPlan(): Plan
    {
        $summary = $this->subscriptionSummary();

        if (! $summary['is_subscribed'] || ! empty($summary['paused'])) {
            return Plan::Free;
        }

        return Plan::tryFrom($summary['tier']) ?? Plan::Free;
    }

    /**
     * Remaining short link edits, or null when unlimited.
     */
    public function slugEditsRemaining(): ?int
    {
        $limit = $this->currentPlan()->slugEditLimit();

        return $limit === null ? null : max(0, $limit - $this->hyperlinks()->where('is_slug_edited', true)->count());
    }

    /**
     * @return HasMany<Logo>
     */
    public function logos(): HasMany
    {
        return $this->hasMany(Logo::class);
    }

    /**
     * Get the active or on-grace-period subscription instance.
     */
    public function activeSubscription(): ?Subscription
    {
        $subscription = $this->subscription('default');

        if ($subscription && $subscription->valid()) {
            return $subscription;
        }

        return null;
    }

    /**
     * Get a comprehensive summary of the user's subscription for frontend consumption.
     *
     * @return array<string, mixed>
     */
    public function subscriptionSummary(): array
    {
        $subscription = $this->activeSubscription();

        if (! $subscription) {
            return [
                'is_subscribed' => false,
                'tier' => 'Free',
                'plan_name' => 'Free Plan',
                'price_id' => null,
                'interval' => null,
                'status' => 'inactive',
                'on_grace_period' => false,
                'ends_at' => null,
                'paddle_id' => null,
            ];
        }

        $firstItem = $subscription->items->first();
        $priceId = $firstItem ? $firstItem->price_id : null;
        $plan = Plans::findByPriceId($priceId);

        return [
            'is_subscribed' => true,
            'tier' => $plan['tier'] ?? 'Subscriber',
            'plan_name' => $plan['name'] ?? 'Active Subscription',
            'price_id' => $priceId,
            'interval' => $plan['interval'] ?? null,
            'status' => $subscription->status,
            'on_grace_period' => $subscription->onGracePeriod(),
            'ends_at' => $subscription->ends_at?->toFormattedDateString(),
            'paddle_id' => $subscription->paddle_id,
            'paused' => $subscription->paused(),
            'past_due' => $subscription->pastDue(),
        ];
    }

    /**
     * Get the hyperlinks for the user.
     *
     * @return HasMany<Hyperlink>
     */
    public function hyperlinks(): HasMany
    {
        return $this->hasMany(Hyperlink::class);
    }

    /**
     * Get the tags for the user.
     *
     * @return HasMany<Tag>
     */
    public function tags(): HasMany
    {
        return $this->hasMany(Tag::class);
    }
}
