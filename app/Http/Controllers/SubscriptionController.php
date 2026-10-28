<?php

namespace App\Http\Controllers;

use App\Support\Plans;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class SubscriptionController extends Controller
{
    /**
     * Get all available subscription plans and their price IDs.
     */
    public function plans(): JsonResponse
    {
        return response()->json([
            'plans' => Plans::all(),
        ]);
    }

    /**
     * Get the current user's subscription summary and all available plans.
     */
    public function status(Request $request): JsonResponse
    {
        return response()->json([
            'subscription' => $request->user()->subscriptionSummary(),
            'plans' => Plans::all(),
            'paddle_client_side_token' => config('cashier.client_side_token'),
            'paddle_sandbox' => (bool) config('cashier.sandbox'),
        ]);
    }

    /**
     * Generate checkout options for subscribing to a plan.
     */
    public function checkout(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'price_id' => ['required', 'string'],
        ]);

        $priceId = Plans::resolvePriceId($validated['price_id']);

        if (! $priceId) {
            return response()->json([
                'message' => 'The selected subscription plan is invalid.',
            ], 422);
        }

        $user = $request->user();

        // If user already subscribed to this exact price
        if ($user->subscribedToPrice($priceId)) {
            return response()->json([
                'message' => 'You are already subscribed to this plan.',
                'already_subscribed' => true,
            ], 422);
        }

        try {
            $checkout = $user
                ->subscribe($priceId, 'default')
                ->returnTo(route('dashboard'));

            return response()->json([
                'checkout' => $checkout->options(),
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Unable to initialize checkout: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Swap the user's active subscription to another plan.
     */
    public function swap(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'price_id' => ['required', 'string'],
        ]);

        $priceId = Plans::resolvePriceId($validated['price_id']);

        if (! $priceId) {
            return response()->json([
                'message' => 'The selected subscription plan is invalid.',
            ], 422);
        }

        $user = $request->user();
        $subscription = $user->activeSubscription();

        if (! $subscription) {
            return response()->json([
                'message' => 'No active subscription found to swap.',
            ], 404);
        }

        if ($subscription->hasPrice($priceId)) {
            return response()->json([
                'message' => 'Your subscription is already on this plan.',
            ], 422);
        }

        try {
            $subscription->swap($priceId);

            return response()->json([
                'message' => 'Subscription updated successfully.',
                'subscription' => $user->fresh()->subscriptionSummary(),
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Unable to swap subscription: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Cancel the user's active subscription.
     */
    public function cancel(Request $request): JsonResponse
    {
        $user = $request->user();
        $subscription = $user->activeSubscription();

        if (! $subscription) {
            return response()->json([
                'message' => 'No active subscription found to cancel.',
            ], 404);
        }

        if ($subscription->onGracePeriod()) {
            return response()->json([
                'message' => 'Subscription is already scheduled for cancellation.',
            ], 422);
        }

        try {
            $subscription->cancel();

            return response()->json([
                'message' => 'Subscription has been canceled and will expire at the end of the current billing cycle.',
                'subscription' => $user->fresh()->subscriptionSummary(),
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Unable to cancel subscription: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Resume a canceled subscription on grace period or a paused subscription.
     */
    public function resume(Request $request): JsonResponse
    {
        $user = $request->user();
        $subscription = $user->subscription('default');

        if (! $subscription || (! $subscription->onGracePeriod() && ! $subscription->paused() && ! $subscription->onPausedGracePeriod())) {
            return response()->json([
                'message' => 'Subscription cannot be resumed because it is not on grace period.',
            ], 422);
        }

        try {
            if ($subscription->onGracePeriod()) {
                $subscription->stopCancelation();
            } else {
                $subscription->resume();
            }

            return response()->json([
                'message' => 'Subscription has been resumed successfully.',
                'subscription' => $user->fresh()->subscriptionSummary(),
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Unable to resume subscription: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get the Paddle payment method update URL.
     */
    public function paymentMethod(Request $request): JsonResponse
    {
        $user = $request->user();
        $subscription = $user->activeSubscription();

        if (! $subscription) {
            return response()->json([
                'message' => 'No active subscription found.',
            ], 404);
        }

        try {
            $url = $subscription->paymentMethodUpdateUrl();

            return response()->json([
                'url' => $url,
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Unable to retrieve payment method update URL: ' . $e->getMessage(),
            ], 500);
        }
    }
}
