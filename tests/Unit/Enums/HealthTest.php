<?php

use App\Enums\Health;

test('health enum has expected cases and values', function () {
    expect(Health::Healthy->value)->toBe('healthy')
        ->and(Health::Unhealthy->value)->toBe('unhealthy')
        ->and(Health::Unreachable->value)->toBe('unreachable');
});

test('health enum can be instantiated from string values', function () {
    expect(Health::from('healthy'))->toBe(Health::Healthy)
        ->and(Health::from('unhealthy'))->toBe(Health::Unhealthy)
        ->and(Health::from('unreachable'))->toBe(Health::Unreachable);
});
