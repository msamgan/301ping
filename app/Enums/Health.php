<?php

namespace App\Enums;

enum Health: string
{
    case Healthy = 'healthy';
    case Unhealthy = 'unhealthy';
    case Unreachable = 'unreachable';
}
