<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Logo extends Model
{
    use HasFactory;

    public const DISK = 'public';

    protected $fillable = [
        'user_id',
        'title',
        'path',
        'mime_type',
        'width',
        'height',
        'size',
    ];

    /**
     * Directory holding this logo: logos/{user_id}.
     */
    public function directory(): string
    {
        return "logos/{$this->user_id}";
    }

    public function url(): ?string
    {
        return $this->path ? Storage::disk(self::DISK)->url($this->path) : null;
    }

    /**
     * @return array<string, mixed>
     */
    public function toFrontend(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'url' => $this->url(),
            'width' => $this->width,
            'height' => $this->height,
            'size' => $this->size,
        ];
    }

    protected static function booted(): void
    {
        static::deleting(function (Logo $logo) {
            if ($logo->path) {
                Storage::disk(self::DISK)->delete($logo->path);
            }
        });
    }

    /**
     * @return BelongsTo<User, Logo>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
