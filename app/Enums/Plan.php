<?php

namespace App\Enums;

enum Plan: string
{
    case Free = 'Free';
    case Redirect = 'Redirect';
    case RedirectPlus = 'Redirect Plus';

    /**
     * Maximum number of logos allowed by this plan.
     */
    public function logoLimit(): ?int
    {
        return match ($this) {
            self::Free => 0,
            self::Redirect => 1,
            self::RedirectPlus => null,
        };
    }

    /**
     * Maximum number of short link edits allowed by this plan (null = unlimited).
     */
    public function slugEditLimit(): ?int
    {
        return match ($this) {
            self::Free => 3,
            default => null,
        };
    }
}
