<?php

namespace App\Services;

use App\Models\User;

class ProfileService
{
    /**
     * Props for the profile edit page.
     *
     * @return array<string, mixed>
     */
    public function editProps(User $user): array
    {
        return [
            'mustVerifyEmail' => true,
            'status' => session('status'),
            'logos' => fn () => $user->logos()->latest()->get()->map->toFrontend()->values(),
            'logoLimit' => fn () => $user->logoLimit(),
        ];
    }
}
