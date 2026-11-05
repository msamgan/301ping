<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));

        $users = User::query()
            ->withCount('hyperlinks')
            ->when($search !== '', function ($query) use ($search) {
                $like = '%' . addcslashes($search, '%_\\') . '%';
                $query->where(fn ($q) => $q->where('name', 'like', $like)->orWhere('email', 'like', $like));
            })
            ->latest()
            ->paginate(15, ['id', 'name', 'email', 'email_verified_at', 'created_at'])
            ->withQueryString();

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'search' => $search,
            'adminIds' => config('admin.user_ids'),
        ]);
    }
}
