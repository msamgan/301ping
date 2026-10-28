<?php

namespace App\Http\Controllers;

use App\Models\Logo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class LogoController extends Controller
{
    public const int MIN_SIZE = 200;

    public const int MAX_SIZE = 4000;

    public const int MAX_KB = 2048;

    /**
     * @throws \Throwable
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $limit = $user->logoLimit();

        if ($limit === 0) {
            throw ValidationException::withMessages([
                'logo' => 'Upgrade to a Redirect plan to upload a logo.',
            ]);
        }

        if ($limit !== null && $user->logos()->count() >= $limit) {
            $logoLabel = $limit === 1 ? 'logo' : 'logos';

            throw ValidationException::withMessages([
                'logo' => "Your plan allows up to {$limit} {$logoLabel}. Delete one to upload another.",
            ]);
        }

        $validated = $request->validate([
            'title' => [
                'required', 'string', 'max:100', 'regex:/[\pL\pN]/u',
                Rule::unique('logos', 'title')->where('user_id', $user->id),
            ],
            'logo' => [
                'required', 'file', 'mimes:png,jpg,jpeg,webp', 'max:' . self::MAX_KB,
                'dimensions:min_width=' . self::MIN_SIZE . ',min_height=' . self::MIN_SIZE
                    . ',max_width=' . self::MAX_SIZE . ',max_height=' . self::MAX_SIZE,
            ],
        ], [
            'logo.dimensions' => 'The logo must be between ' . self::MIN_SIZE . 'x' . self::MIN_SIZE . ' and '
                . self::MAX_SIZE . 'x' . self::MAX_SIZE . ' pixels.',
            'logo.max' => 'The logo may not be larger than 2 MB.',
        ]);

        $file = $validated['logo'];
        [$width, $height] = getimagesize($file->getRealPath());
        $extension = $file->extension() ?: $file->getClientOriginalExtension();

        DB::transaction(function () use ($user, $validated, $file, $width, $height, $extension) {
            $logo = $user->logos()->create([
                'title' => $validated['title'],
                'mime_type' => $file->getMimeType(),
                'width' => $width,
                'height' => $height,
                'size' => $file->getSize(),
            ]);

            $name = Str::slug($validated['title']) ?: 'logo';

            $disk = Storage::disk(Logo::DISK);
            $filename = "{$name}.{$extension}";

            if ($disk->exists($logo->directory() . '/' . $filename)) {
                $filename = "{$name}-{$logo->id}.{$extension}";
            }

            $logo->path = $file->storeAs($logo->directory(), $filename, Logo::DISK);
            $logo->save();
        });

        return back();
    }

    public function destroy(Request $request, Logo $logo): RedirectResponse
    {
        abort_unless($logo->user_id === $request->user()->id, 403);

        $logo->delete();

        return back();
    }
}
