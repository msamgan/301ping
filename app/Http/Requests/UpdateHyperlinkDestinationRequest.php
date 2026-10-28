<?php

namespace App\Http\Requests;

use App\Models\Hyperlink;
use App\Rules\SafeUrl;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateHyperlinkDestinationRequest extends FormRequest
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
        return [
            'url' => ['required', 'url', new SafeUrl],
        ];
    }
}
