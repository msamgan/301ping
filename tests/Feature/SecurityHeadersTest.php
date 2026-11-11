<?php

it('includes the strict transport security header', function () {
    $this->app['env'] = 'production';

    $this->get('/')
        ->assertHeader('Strict-Transport-Security', 'max-age=31536000');
});
