<?php

it('includes the strict transport security header', function () {
    $this->app['env'] = 'production';

    $this->get('/')
        ->assertHeader('Strict-Transport-Security', 'max-age=31536000');
});

it('trusts forwarded proto headers and recognizes secure requests behind proxy', function () {
    $this->get('/', ['X-Forwarded-Proto' => 'https', 'X-Forwarded-Port' => '443'])
        ->assertOk();

    expect(request()->isSecure())->toBeTrue();
});
