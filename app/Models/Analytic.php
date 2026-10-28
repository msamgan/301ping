<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $hyperlink_id
 * @property string|null $ip
 * @property string|null $country
 * @property string|null $country_code
 * @property string|null $city
 * @property string|null $region
 * @property string|null $region_code
 * @property string|null $postal_code
 * @property float|null $latitude
 * @property float|null $longitude
 * @property string|null $timezone
 * @property string|null $user_agent
 * @property string|null $device
 * @property string|null $device_brand
 * @property string|null $device_model
 * @property string|null $browser
 * @property string|null $browser_version
 * @property string|null $os
 * @property string|null $os_version
 * @property bool $is_robot
 * @property string|null $robot_name
 * @property string|null $referer
 * @property string|null $referer_host
 * @property string|null $language
 * @property array|null $languages
 * @property array|null $query_params
 * @property string|null $utm_source
 * @property string|null $utm_medium
 * @property string|null $utm_campaign
 * @property string|null $utm_term
 * @property string|null $utm_content
 * @property array|null $headers
 * @property string|null $http_method
 * @property string|null $scheme
 * @property string|null $host
 * @property string|null $url
 * @property Carbon|null $visited_at
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class Analytic extends Model
{
    use HasFactory;

    protected $table = 'analytics';

    protected $fillable = [
        'hyperlink_id',
        'ip',
        'country',
        'country_code',
        'city',
        'region',
        'region_code',
        'postal_code',
        'latitude',
        'longitude',
        'timezone',
        'user_agent',
        'device',
        'device_brand',
        'device_model',
        'browser',
        'browser_version',
        'os',
        'os_version',
        'is_robot',
        'robot_name',
        'referer',
        'referer_host',
        'language',
        'languages',
        'query_params',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'headers',
        'http_method',
        'scheme',
        'host',
        'url',
        'visited_at',
    ];

    protected $casts = [
        'is_robot' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
        'languages' => 'array',
        'query_params' => 'array',
        'headers' => 'array',
        'visited_at' => 'datetime',
    ];

    /**
     * @return BelongsTo<Hyperlink, Analytic>
     */
    public function hyperlink(): BelongsTo
    {
        return $this->belongsTo(Hyperlink::class);
    }
}
