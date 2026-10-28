<?php

namespace App\Enums;

enum Plan: string
{
    case Free = 'Free';
    case Redirect = 'Redirect';
    case RedirectPlus = 'Redirect Plus';

    /**
     * Maximum number of logos allowed by this plan (null = unlimited).
     */
    public function logoLimit(): ?int
    {
        return match ($this) {
            self::Free => 0,
            self::Redirect => 1,
            self::RedirectPlus => 5,
        };
    }

    /**
     * Maximum number of short links that can be created via the API per day.
     */
    public function apiDailyLimit(): int
    {
        return match ($this) {
            self::Free => 40,
            self::Redirect => 100,
            self::RedirectPlus => 300,
        };
    }

    /**
     * Maximum number of custom links allowed by this plan (null = unlimited).
     */
    public function slugEditLimit(): ?int
    {
        return match ($this) {
            self::Free => 3,
            self::Redirect => 10,
            self::RedirectPlus => 25,
        };
    }

    /**
     * Maximum number of destinations that can be edited by this plan (null = unlimited).
     */
    public function destinationEditLimit(): ?int
    {
        return match ($this) {
            self::Free => 1,
            default => null,
        };
    }
}
