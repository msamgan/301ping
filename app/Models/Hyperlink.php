<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;

/**
 * @method static create(array $array)
 *
 * @property string $id
 * @property string $url
 * @property string $shot_slug
 * @property int $visits
 * @property bool $is_active
 * @property bool $is_edited
 * @property string $last_visit
 * @property string $user_id
 * @property string $logo_id
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class Hyperlink extends Model
{
    use HasFactory, HasUuids;

    /**
     * @var mixed|null
     */
    protected $fillable = [
        'user_id',
        'url',
        'shot_slug',
        'visits',
        'is_active',
        'is_edited',
        'last_visit',
        'logo_id',
    ];

    protected $casts = ['is_edited' => 'boolean'];

    protected $keyType = 'string';

    /**
     * @return BelongsTo<Logo, Hyperlink>
     */
    public function logo(): BelongsTo
    {
        return $this->belongsTo(Logo::class);
    }

    /**
     * Get the user that owns the hyperlink.
     *
     * @return BelongsTo<User, Hyperlink>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsToMany<Tag, Hyperlink>
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'hyperlink_tag')->withTimestamps();
    }
}
