<?php

namespace App\Http\Requests;

use App\Models\Hyperlink;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;

class UpdateHyperlinkSlugRequest extends FormRequest
{
    public function authorize(): bool
    {
        $hyperlink = $this->route('hyperlink');

        return $hyperlink instanceof Hyperlink
            && $this->user()?->id === $hyperlink->user_id;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $hyperlink = $this->route('hyperlink');
        $hyperlinkId = $hyperlink instanceof Hyperlink ? $hyperlink->id : null;
        $reserved = collect(Route::getRoutes()->getRoutes())
            ->map(fn ($route) => strtolower(explode('/', trim($route->uri(), '/'))[0]))
            ->reject(fn ($segment) => $segment === '' || str_starts_with($segment, '{'))
            ->unique()
            ->all();

        return [
            'shot_slug' => [
                'required',
                'string',
                'min:3',
                'max:8',
                'regex:/^(?=.*[A-Za-z0-9])[A-Za-z0-9\-_.~]+$/',
                Rule::unique('hyperlinks', 'shot_slug')->ignore($hyperlinkId),
                fn ($attribute, $value, $fail) => in_array(strtolower($value), $reserved, true)
                    ? $fail('This short link is reserved.')
                    : null,
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'shot_slug.regex' => 'Use only letters, numbers, and - _ . ~ characters.',
            'shot_slug.unique' => 'This short link is already taken.',
        ];
    }
}
