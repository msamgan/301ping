<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OA;

#[OA\Info(
    version: '1.0.0',
    description: 'API documentation for URL shortening service',
    title: '301 ping API',
    contact: new OA\Contact(email: 'hello@301p.ing')
)]
#[OA\Server(
    url: '/',
    description: 'Current Environment Server'
)]
#[OA\SecurityScheme(
    securityScheme: 'bearerAuth',
    type: 'http',
    description: 'Enter your Bearer token to authenticate requests',
    bearerFormat: 'JWT',
    scheme: 'bearer'
)]
abstract class Controller
{
    //
}
