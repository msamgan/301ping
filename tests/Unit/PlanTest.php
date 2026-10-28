<?php

use App\Enums\Plan;

test('custom link limits vary by plan', function () {
    expect(Plan::Free->slugEditLimit())->toBe(3)
        ->and(Plan::Redirect->slugEditLimit())->toBe(10)
        ->and(Plan::RedirectPlus->slugEditLimit())->toBe(25);
});
