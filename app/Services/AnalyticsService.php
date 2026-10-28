<?php

namespace App\Services;

use App\Jobs\RecordAnalyticsJob;
use App\Models\Analytic;
use App\Models\Hyperlink;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Throwable;

class AnalyticsService
{
    /**
     * Map of common ISO 3166-1 alpha-2 country codes to English country names.
     *
     * @var array<string, string>
     */
    protected static array $countries = [
        'AD' => 'Andorra',
        'AE' => 'United Arab Emirates',
        'AF' => 'Afghanistan',
        'AG' => 'Antigua and Barbuda',
        'AI' => 'Anguilla',
        'AL' => 'Albania',
        'AM' => 'Armenia',
        'AO' => 'Angola',
        'AQ' => 'Antarctica',
        'AR' => 'Argentina',
        'AS' => 'American Samoa',
        'AT' => 'Austria',
        'AU' => 'Australia',
        'AW' => 'Aruba',
        'AX' => 'Åland Islands',
        'AZ' => 'Azerbaijan',
        'BA' => 'Bosnia and Herzegovina',
        'BB' => 'Barbados',
        'BD' => 'Bangladesh',
        'BE' => 'Belgium',
        'BF' => 'Burkina Faso',
        'BG' => 'Bulgaria',
        'BH' => 'Bahrain',
        'BI' => 'Burundi',
        'BJ' => 'Benin',
        'BL' => 'Saint Barthélemy',
        'BM' => 'Bermuda',
        'BN' => 'Brunei',
        'BO' => 'Bolivia',
        'BQ' => 'Caribbean Netherlands',
        'BR' => 'Brazil',
        'BS' => 'Bahamas',
        'BT' => 'Bhutan',
        'BV' => 'Bouvet Island',
        'BW' => 'Botswana',
        'BY' => 'Belarus',
        'BZ' => 'Belize',
        'CA' => 'Canada',
        'CC' => 'Cocos (Keeling) Islands',
        'CD' => 'Congo (DRC)',
        'CF' => 'Central African Republic',
        'CG' => 'Congo (Republic)',
        'CH' => 'Switzerland',
        'CI' => 'Ivory Coast',
        'CK' => 'Cook Islands',
        'CL' => 'Chile',
        'CM' => 'Cameroon',
        'CN' => 'China',
        'CO' => 'Colombia',
        'CR' => 'Costa Rica',
        'CU' => 'Cuba',
        'CV' => 'Cape Verde',
        'CW' => 'Curaçao',
        'CX' => 'Christmas Island',
        'CY' => 'Cyprus',
        'CZ' => 'Czech Republic',
        'DE' => 'Germany',
        'DJ' => 'Djibouti',
        'DK' => 'Denmark',
        'DM' => 'Dominica',
        'DO' => 'Dominican Republic',
        'DZ' => 'Algeria',
        'EC' => 'Ecuador',
        'EE' => 'Estonia',
        'EG' => 'Egypt',
        'EH' => 'Western Sahara',
        'ER' => 'Eritrea',
        'ES' => 'Spain',
        'ET' => 'Ethiopia',
        'FI' => 'Finland',
        'FJ' => 'Fiji',
        'FK' => 'Falkland Islands',
        'FM' => 'Micronesia',
        'FO' => 'Faroe Islands',
        'FR' => 'France',
        'GA' => 'Gabon',
        'GB' => 'United Kingdom',
        'GD' => 'Grenada',
        'GE' => 'Georgia',
        'GF' => 'French Guiana',
        'GG' => 'Guernsey',
        'GH' => 'Ghana',
        'GI' => 'Gibraltar',
        'GL' => 'Greenland',
        'GM' => 'Gambia',
        'GN' => 'Guinea',
        'GP' => 'Guadeloupe',
        'GQ' => 'Equatorial Guinea',
        'GR' => 'Greece',
        'GS' => 'South Georgia & South Sandwich Islands',
        'GT' => 'Guatemala',
        'GU' => 'Guam',
        'GW' => 'Guinea-Bissau',
        'GY' => 'Guyana',
        'HK' => 'Hong Kong',
        'HM' => 'Heard Island and McDonald Islands',
        'HN' => 'Honduras',
        'HR' => 'Croatia',
        'HT' => 'Haiti',
        'HU' => 'Hungary',
        'ID' => 'Indonesia',
        'IE' => 'Ireland',
        'IL' => 'Israel',
        'IM' => 'Isle of Man',
        'IN' => 'India',
        'IO' => 'British Indian Ocean Territory',
        'IQ' => 'Iraq',
        'IR' => 'Iran',
        'IS' => 'Iceland',
        'IT' => 'Italy',
        'JE' => 'Jersey',
        'JM' => 'Jamaica',
        'JO' => 'Jordan',
        'JP' => 'Japan',
        'KE' => 'Kenya',
        'KG' => 'Kyrgyzstan',
        'KH' => 'Cambodia',
        'KI' => 'Kiribati',
        'KM' => 'Comoros',
        'KN' => 'Saint Kitts and Nevis',
        'KP' => 'North Korea',
        'KR' => 'South Korea',
        'KW' => 'Kuwait',
        'KY' => 'Cayman Islands',
        'KZ' => 'Kazakhstan',
        'LA' => 'Laos',
        'LB' => 'Lebanon',
        'LC' => 'Saint Lucia',
        'LI' => 'Liechtenstein',
        'LK' => 'Sri Lanka',
        'LR' => 'Liberia',
        'LS' => 'Lesotho',
        'LT' => 'Lithuania',
        'LU' => 'Luxembourg',
        'LV' => 'Latvia',
        'LY' => 'Libya',
        'MA' => 'Morocco',
        'MC' => 'Monaco',
        'MD' => 'Moldova',
        'ME' => 'Montenegro',
        'MF' => 'Saint Martin',
        'MG' => 'Madagascar',
        'MH' => 'Marshall Islands',
        'MK' => 'North Macedonia',
        'ML' => 'Mali',
        'MM' => 'Myanmar',
        'MN' => 'Mongolia',
        'MO' => 'Macao',
        'MP' => 'Northern Mariana Islands',
        'MQ' => 'Martinique',
        'MR' => 'Mauritania',
        'MS' => 'Montserrat',
        'MT' => 'Malta',
        'MU' => 'Mauritius',
        'MV' => 'Maldives',
        'MW' => 'Malawi',
        'MX' => 'Mexico',
        'MY' => 'Malaysia',
        'MZ' => 'Mozambique',
        'NA' => 'Namibia',
        'NC' => 'New Caledonia',
        'NE' => 'Niger',
        'NF' => 'Norfolk Island',
        'NG' => 'Nigeria',
        'NI' => 'Nicaragua',
        'NL' => 'Netherlands',
        'NO' => 'Norway',
        'NP' => 'Nepal',
        'NR' => 'Nauru',
        'NU' => 'Niue',
        'NZ' => 'New Zealand',
        'OM' => 'Oman',
        'PA' => 'Panama',
        'PE' => 'Peru',
        'PF' => 'French Polynesia',
        'PG' => 'Papua New Guinea',
        'PH' => 'Philippines',
        'PK' => 'Pakistan',
        'PL' => 'Poland',
        'PM' => 'Saint Pierre and Miquelon',
        'PN' => 'Pitcairn Islands',
        'PR' => 'Puerto Rico',
        'PS' => 'Palestine',
        'PT' => 'Portugal',
        'PW' => 'Palau',
        'PY' => 'Paraguay',
        'QA' => 'Qatar',
        'RE' => 'Réunion',
        'RO' => 'Romania',
        'RS' => 'Serbia',
        'RU' => 'Russia',
        'RW' => 'Rwanda',
        'SA' => 'Saudi Arabia',
        'SB' => 'Solomon Islands',
        'SC' => 'Seychelles',
        'SD' => 'Sudan',
        'SE' => 'Sweden',
        'SG' => 'Singapore',
        'SH' => 'Saint Helena',
        'SI' => 'Slovenia',
        'SJ' => 'Svalbard and Jan Mayen',
        'SK' => 'Slovakia',
        'SL' => 'Sierra Leone',
        'SM' => 'San Marino',
        'SN' => 'Senegal',
        'SO' => 'Somalia',
        'SR' => 'Suriname',
        'SS' => 'South Sudan',
        'ST' => 'São Tomé and Príncipe',
        'SV' => 'El Salvador',
        'SX' => 'Sint Maarten',
        'SY' => 'Syria',
        'SZ' => 'Eswatini',
        'TC' => 'Turks and Caicos Islands',
        'TD' => 'Chad',
        'TF' => 'French Southern Territories',
        'TG' => 'Togo',
        'TH' => 'Thailand',
        'TJ' => 'Tajikistan',
        'TK' => 'Tokelau',
        'TL' => 'Timor-Leste',
        'TM' => 'Turkmenistan',
        'TN' => 'Tunisia',
        'TO' => 'Tonga',
        'TR' => 'Turkey',
        'TT' => 'Trinidad and Tobago',
        'TV' => 'Tuvalu',
        'TW' => 'Taiwan',
        'TZ' => 'Tanzania',
        'UA' => 'Ukraine',
        'UG' => 'Uganda',
        'UM' => 'U.S. Outlying Islands',
        'US' => 'United States',
        'UY' => 'Uruguay',
        'UZ' => 'Uzbekistan',
        'VA' => 'Vatican City',
        'VC' => 'Saint Vincent and the Grenadines',
        'VE' => 'Venezuela',
        'VG' => 'British Virgin Islands',
        'VI' => 'U.S. Virgin Islands',
        'VN' => 'Vietnam',
        'VU' => 'Vanuatu',
        'WF' => 'Wallis and Futuna',
        'WS' => 'Samoa',
        'YE' => 'Yemen',
        'YT' => 'Mayotte',
        'ZA' => 'South Africa',
        'ZM' => 'Zambia',
        'ZW' => 'Zimbabwe',
    ];

    /**
     * Record request analytics for a visited hyperlink.
     */
    public static function record(Hyperlink $hyperlink, Request|array $request): ?Analytic
    {
        try {
            $data = static::extractData($request);
            $data['hyperlink_id'] = $hyperlink->id;

            return $hyperlink->analytics()->create($data);
        } catch (Throwable $e) {
            report($e);

            return null;
        }
    }

    /**
     * Asynchronously record request analytics using background job.
     */
    public static function recordAsync(Hyperlink $hyperlink, Request|array $request): void
    {
        try {
            $payload = $request instanceof Request ? static::snapshotRequest($request) : $request;
            RecordAnalyticsJob::dispatch($hyperlink, $payload);
        } catch (Throwable $e) {
            report($e);
        }
    }

    /**
     * Update an existing analytic record from request data.
     */
    public static function update(Analytic $analytic, Request|array $request): ?Analytic
    {
        try {
            $data = static::extractData($request);
            $analytic->update($data);

            return $analytic;
        } catch (Throwable $e) {
            report($e);

            return null;
        }
    }

    /**
     * Snapshot an incoming Request into a serializable array for queue payload.
     *
     * @return array<string, mixed>
     */
    public static function snapshotRequest(Request $request): array
    {
        return [
            'ip' => static::extractIp($request),
            'headers' => $request->headers->all(),
            'user_agent' => $request->header('User-Agent'),
            'referer' => $request->header('Referer') ?: $request->header('Referrer'),
            'languages' => $request->getLanguages(),
            'preferred_language' => $request->getPreferredLanguage(),
            'query' => $request->query(),
            'method' => $request->method(),
            'scheme' => $request->getScheme(),
            'host' => $request->getHost(),
            'url' => $request->fullUrl(),
            'visited_at' => now()->toIso8601String(),
        ];
    }

    /**
     * Extract all captureable data from the incoming request or payload array.
     *
     * @return array<string, mixed>
     */
    public static function extractData(Request|array $request): array
    {
        $ip = static::extractIp($request);
        $geo = static::extractGeo($request, $ip);

        $userAgent = static::getHeader($request, 'User-Agent')
            ?: ($request instanceof Request ? null : ($request['user_agent'] ?? null));

        $agentInfo = static::parseUserAgent($userAgent);

        $referer = static::getHeader($request, 'Referer')
            ?: static::getHeader($request, 'Referrer')
            ?: ($request instanceof Request ? null : ($request['referer'] ?? $request['referrer'] ?? null));

        $refererHost = $referer ? parse_url($referer, PHP_URL_HOST) : null;

        if ($request instanceof Request) {
            $languages = $request->getLanguages();
            $language = $request->getPreferredLanguage() ?: ($languages[0] ?? null);
            $queryParams = $request->query();
            $utmSource = $request->query('utm_source');
            $utmMedium = $request->query('utm_medium');
            $utmCampaign = $request->query('utm_campaign');
            $utmTerm = $request->query('utm_term');
            $utmContent = $request->query('utm_content');
            $method = $request->method();
            $scheme = $request->getScheme();
            $host = $request->getHost();
            $url = $request->fullUrl();
            $visitedAt = now();
        } else {
            $languages = $request['languages'] ?? [];
            if (! is_array($languages) && is_string($languages)) {
                $languages = array_map('trim', explode(',', $languages));
            }
            $language = $request['language'] ?? $request['preferred_language'] ?? ($languages[0] ?? null);
            $queryParams = $request['query'] ?? $request['query_params'] ?? [];
            if (! is_array($queryParams)) {
                $queryParams = [];
            }
            $utmSource = $request['utm_source'] ?? ($queryParams['utm_source'] ?? null);
            $utmMedium = $request['utm_medium'] ?? ($queryParams['utm_medium'] ?? null);
            $utmCampaign = $request['utm_campaign'] ?? ($queryParams['utm_campaign'] ?? null);
            $utmTerm = $request['utm_term'] ?? ($queryParams['utm_term'] ?? null);
            $utmContent = $request['utm_content'] ?? ($queryParams['utm_content'] ?? null);
            $method = $request['method'] ?? $request['http_method'] ?? 'GET';
            $scheme = $request['scheme'] ?? null;
            $host = $request['host'] ?? null;
            $url = $request['url'] ?? $request['full_url'] ?? null;
            $visitedAt = isset($request['visited_at']) ? Carbon::parse($request['visited_at']) : now();
        }

        return [
            'ip' => $ip,
            'country' => $geo['country'],
            'country_code' => $geo['country_code'],
            'city' => $geo['city'],
            'region' => $geo['region'],
            'region_code' => $geo['region_code'],
            'postal_code' => $geo['postal_code'],
            'latitude' => $geo['latitude'],
            'longitude' => $geo['longitude'],
            'timezone' => $geo['timezone'],
            'user_agent' => $userAgent,
            'device' => $agentInfo['device'],
            'device_brand' => $agentInfo['device_brand'],
            'device_model' => $agentInfo['device_model'],
            'browser' => $agentInfo['browser'],
            'browser_version' => $agentInfo['browser_version'],
            'os' => $agentInfo['os'],
            'os_version' => $agentInfo['os_version'],
            'is_robot' => $agentInfo['is_robot'],
            'robot_name' => $agentInfo['robot_name'],
            'referer' => $referer,
            'referer_host' => $refererHost,
            'language' => $language,
            'languages' => ! empty($languages) ? $languages : null,
            'query_params' => ! empty($queryParams) ? $queryParams : null,
            'utm_source' => $utmSource,
            'utm_medium' => $utmMedium,
            'utm_campaign' => $utmCampaign,
            'utm_term' => $utmTerm,
            'utm_content' => $utmContent,
            'headers' => static::extractSafeHeaders($request),
            'http_method' => $method,
            'scheme' => $scheme,
            'host' => $host,
            'url' => $url,
            'visited_at' => $visitedAt,
        ];
    }

    /**
     * Get a header value from Request or array payload (case-insensitive).
     */
    protected static function getHeader(Request|array $request, string $name): ?string
    {
        if ($request instanceof Request) {
            return $request->header($name);
        }

        $headers = $request['headers'] ?? [];
        if (is_array($headers)) {
            foreach ($headers as $key => $value) {
                if (strcasecmp((string) $key, $name) === 0) {
                    return is_array($value) ? ($value[0] ?? null) : (string) $value;
                }
            }
        }

        foreach ($request as $key => $value) {
            if (strcasecmp(str_replace('_', '-', (string) $key), str_replace('_', '-', $name)) === 0 && ! is_array($value)) {
                return (string) $value;
            }
        }

        return null;
    }

    /**
     * Extract the client's public or proxy IP address.
     */
    protected static function extractIp(Request|array $request): ?string
    {
        $headersToCheck = [
            'CF-Connecting-IP',
            'True-Client-IP',
            'X-Real-IP',
            'X-Forwarded-For',
            'X-Client-IP',
        ];

        foreach ($headersToCheck as $header) {
            $value = static::getHeader($request, $header);
            if ($value) {
                // If multiple IPs present, take the first one
                $ip = trim(explode(',', $value)[0]);
                if (filter_var($ip, FILTER_VALIDATE_IP)) {
                    return $ip;
                }
            }
        }

        if ($request instanceof Request) {
            return $request->ip();
        }

        $ip = $request['ip'] ?? null;
        if ($ip && filter_var($ip, FILTER_VALIDATE_IP)) {
            return (string) $ip;
        }

        return is_string($ip) ? $ip : null;
    }

    /**
     * Extract geographic location data from standard proxy / CDN headers.
     *
     * @return array<string, mixed>
     */
    protected static function extractGeo(Request|array $request, ?string $ip): array
    {
        $countryCode = static::getHeader($request, 'CF-IPCountry')
            ?: static::getHeader($request, 'CloudFront-Viewer-Country')
            ?: static::getHeader($request, 'X-Vercel-IP-Country')
            ?: static::getHeader($request, 'X-Country-Code')
            ?: static::getHeader($request, 'X-Geo-Country')
            ?: static::getHeader($request, 'GeoIP-Country-Code')
            ?: ($request instanceof Request ? null : ($request['country_code'] ?? null));

        if ($countryCode) {
            $countryCode = strtoupper(trim($countryCode));
            if ($countryCode === 'XX' || $countryCode === 'T1') {
                $countryCode = null;
            }
        }

        $country = static::getHeader($request, 'CloudFront-Viewer-Country-Name')
            ?: static::getHeader($request, 'X-Geo-Country-Name')
            ?: ($countryCode ? (static::$countries[$countryCode] ?? null) : null)
            ?: ($request instanceof Request ? null : ($request['country'] ?? null));

        $city = static::getHeader($request, 'CF-IPCity')
            ?: static::getHeader($request, 'CloudFront-Viewer-City')
            ?: static::getHeader($request, 'X-Vercel-IP-City')
            ?: static::getHeader($request, 'X-Geo-City')
            ?: static::getHeader($request, 'X-City')
            ?: ($request instanceof Request ? null : ($request['city'] ?? null));

        $regionCode = static::getHeader($request, 'CF-Region-Code')
            ?: static::getHeader($request, 'CloudFront-Viewer-Country-Region')
            ?: static::getHeader($request, 'X-Vercel-IP-Country-Region')
            ?: static::getHeader($request, 'X-Geo-Region-Code')
            ?: ($request instanceof Request ? null : ($request['region_code'] ?? null));

        $region = static::getHeader($request, 'CF-Region')
            ?: static::getHeader($request, 'CloudFront-Viewer-Country-Region-Name')
            ?: static::getHeader($request, 'X-Geo-Region')
            ?: $regionCode
            ?: ($request instanceof Request ? null : ($request['region'] ?? null));

        $postalCode = static::getHeader($request, 'CF-Postal-Code')
            ?: static::getHeader($request, 'CloudFront-Viewer-Postal-Code')
            ?: static::getHeader($request, 'X-Vercel-IP-Postal-Code')
            ?: static::getHeader($request, 'X-Geo-Postal-Code')
            ?: ($request instanceof Request ? null : ($request['postal_code'] ?? null));

        $latitude = static::getHeader($request, 'CF-Latitude')
            ?: static::getHeader($request, 'CloudFront-Viewer-Latitude')
            ?: static::getHeader($request, 'X-Vercel-IP-Latitude')
            ?: static::getHeader($request, 'X-Geo-Latitude')
            ?: ($request instanceof Request ? null : ($request['latitude'] ?? null));

        $longitude = static::getHeader($request, 'CF-Longitude')
            ?: static::getHeader($request, 'CloudFront-Viewer-Longitude')
            ?: static::getHeader($request, 'X-Vercel-IP-Longitude')
            ?: static::getHeader($request, 'X-Geo-Longitude')
            ?: ($request instanceof Request ? null : ($request['longitude'] ?? null));

        $timezone = static::getHeader($request, 'CF-Timezone')
            ?: static::getHeader($request, 'CloudFront-Viewer-Time-Zone')
            ?: static::getHeader($request, 'X-Vercel-IP-Timezone')
            ?: static::getHeader($request, 'X-Geo-Timezone')
            ?: ($request instanceof Request ? null : ($request['timezone'] ?? null));

        // Check PHP geoip extension if available and some fields are empty
        if ((! $countryCode || ! $city) && $ip && function_exists('geoip_record_by_name')) {
            try {
                $record = @geoip_record_by_name($ip);
                if (is_array($record)) {
                    $countryCode = $countryCode ?: ($record['country_code'] ?? null);
                    $country = $country ?: ($record['country_name'] ?? ($countryCode ? (static::$countries[$countryCode] ?? null) : null));
                    $city = $city ?: ($record['city'] ?? null);
                    $regionCode = $regionCode ?: ($record['region'] ?? null);
                    $region = $region ?: ($record['region'] ?? null);
                    $postalCode = $postalCode ?: ($record['postal_code'] ?? null);
                    $latitude = $latitude !== null ? $latitude : ($record['latitude'] ?? null);
                    $longitude = $longitude !== null ? $longitude : ($record['longitude'] ?? null);
                    $timezone = $timezone ?: ($record['timezone'] ?? null);
                }
            } catch (Throwable) {
                // Ignore geoip extension errors
            }
        }

        return [
            'country' => $country ? trim($country) : null,
            'country_code' => $countryCode ? trim($countryCode) : null,
            'city' => $city ? trim($city) : null,
            'region' => $region ? trim($region) : null,
            'region_code' => $regionCode ? trim($regionCode) : null,
            'postal_code' => $postalCode ? trim($postalCode) : null,
            'latitude' => $latitude !== null && is_numeric($latitude) ? (float) $latitude : null,
            'longitude' => $longitude !== null && is_numeric($longitude) ? (float) $longitude : null,
            'timezone' => $timezone ? trim($timezone) : null,
        ];
    }

    /**
     * Parse User-Agent string to extract device, OS, browser, and robot information.
     *
     * @return array<string, mixed>
     */
    public static function parseUserAgent(?string $ua): array
    {
        if (empty($ua)) {
            return [
                'device' => 'unknown',
                'device_brand' => null,
                'device_model' => null,
                'browser' => null,
                'browser_version' => null,
                'os' => null,
                'os_version' => null,
                'is_robot' => false,
                'robot_name' => null,
            ];
        }

        $robotInfo = static::detectRobot($ua);
        if ($robotInfo['is_robot']) {
            return [
                'device' => 'bot',
                'device_brand' => null,
                'device_model' => null,
                'browser' => $robotInfo['robot_name'],
                'browser_version' => null,
                'os' => null,
                'os_version' => null,
                'is_robot' => true,
                'robot_name' => $robotInfo['robot_name'],
            ];
        }

        $osInfo = static::detectOs($ua);
        $browserInfo = static::detectBrowser($ua);
        $deviceInfo = static::detectDevice($ua, $osInfo['os']);

        return [
            'device' => $deviceInfo['device'],
            'device_brand' => $deviceInfo['device_brand'],
            'device_model' => $deviceInfo['device_model'],
            'browser' => $browserInfo['browser'],
            'browser_version' => $browserInfo['browser_version'],
            'os' => $osInfo['os'],
            'os_version' => $osInfo['os_version'],
            'is_robot' => false,
            'robot_name' => null,
        ];
    }

    /**
     * Detect search engines, crawlers, and bots.
     *
     * @return array{is_robot: bool, robot_name: ?string}
     */
    protected static function detectRobot(string $ua): array
    {
        $bots = [
            'Googlebot' => 'Googlebot',
            'Google-Site-Verification' => 'Google Verification',
            'Google-InspectionTool' => 'Google Inspection Tool',
            'Mediapartners-Google' => 'Google AdSense',
            'FeedFetcher-Google' => 'Google Feedfetcher',
            'bingbot' => 'Bingbot',
            'Baiduspider' => 'Baidu Spider',
            'YandexBot' => 'YandexBot',
            'DuckDuckBot' => 'DuckDuckBot',
            'Sogou' => 'Sogou',
            'Exabot' => 'Exabot',
            'facebookexternalhit' => 'Facebook External Hit',
            'Facebot' => 'Facebook Bot',
            'Twitterbot' => 'Twitterbot',
            'LinkedInBot' => 'LinkedInBot',
            'TelegramBot' => 'TelegramBot',
            'WhatsApp' => 'WhatsApp',
            'Discordbot' => 'Discordbot',
            'Slackbot' => 'Slackbot',
            'Applebot' => 'Applebot',
            'Pinterest' => 'Pinterest Bot',
            'AhrefsBot' => 'AhrefsBot',
            'SEMrushBot' => 'SEMrushBot',
            'DotBot' => 'DotBot',
            'PetalBot' => 'PetalBot',
            'MJ12bot' => 'MJ12bot',
            'curl' => 'cURL',
            'Wget' => 'Wget',
            'Python' => 'Python Requests',
            'PostmanRuntime' => 'Postman',
            'GuzzleHttp' => 'GuzzleHttp',
            'Apache-HttpClient' => 'Apache HttpClient',
        ];

        foreach ($bots as $pattern => $name) {
            if (stripos($ua, $pattern) !== false) {
                return ['is_robot' => true, 'robot_name' => $name];
            }
        }

        if (preg_match('/(bot|crawl|spider|slurp|crawler|spidering)/i', $ua)) {
            return ['is_robot' => true, 'robot_name' => 'Generic Bot'];
        }

        return ['is_robot' => false, 'robot_name' => null];
    }

    /**
     * Detect Operating System and version.
     *
     * @return array{os: ?string, os_version: ?string}
     */
    protected static function detectOs(string $ua): array
    {
        // iOS
        if (preg_match('/(?:iPhone|iPad|iPod).*?OS (\d+[_\.]\d+(?:[_\.]\d+)?)/i', $ua, $matches)) {
            return [
                'os' => 'iOS',
                'os_version' => str_replace('_', '.', $matches[1]),
            ];
        }

        // Android
        if (preg_match('/Android\s*([0-9\.]+)?/i', $ua, $matches)) {
            return [
                'os' => 'Android',
                'os_version' => $matches[1] ?? null,
            ];
        }

        // macOS
        if (preg_match('/Mac OS X\s*([0-9_\.]+)?/i', $ua, $matches) || stripos($ua, 'Macintosh') !== false) {
            $version = isset($matches[1]) ? str_replace('_', '.', $matches[1]) : null;

            return [
                'os' => 'macOS',
                'os_version' => $version,
            ];
        }

        // Windows
        if (preg_match('/Windows NT\s*([0-9\.]+)?/i', $ua, $matches)) {
            $ntVersion = $matches[1] ?? '';
            $osVersion = match ($ntVersion) {
                '10.0' => '10/11',
                '6.3' => '8.1',
                '6.2' => '8',
                '6.1' => '7',
                '6.0' => 'Vista',
                '5.1', '5.2' => 'XP',
                default => $ntVersion ?: null,
            };

            return [
                'os' => 'Windows',
                'os_version' => $osVersion,
            ];
        }

        // Chrome OS
        if (preg_match('/CrOS\s+[^\s]+\s+([0-9\.]+)/i', $ua, $matches)) {
            return [
                'os' => 'Chrome OS',
                'os_version' => $matches[1] ?? null,
            ];
        }

        // Linux
        if (stripos($ua, 'Linux') !== false || stripos($ua, 'X11') !== false) {
            if (stripos($ua, 'Ubuntu') !== false) {
                return ['os' => 'Ubuntu', 'os_version' => null];
            }
            if (stripos($ua, 'Fedora') !== false) {
                return ['os' => 'Fedora', 'os_version' => null];
            }

            return ['os' => 'Linux', 'os_version' => null];
        }

        return ['os' => null, 'os_version' => null];
    }

    /**
     * Detect Web Browser and version.
     *
     * @return array{browser: ?string, browser_version: ?string}
     */
    protected static function detectBrowser(string $ua): array
    {
        // Edge
        if (preg_match('/(?:Edg|Edge)\/([0-9\.]+)/i', $ua, $matches)) {
            return ['browser' => 'Edge', 'browser_version' => $matches[1]];
        }

        // Opera
        if (preg_match('/(?:OPR|Opera)\/([0-9\.]+)/i', $ua, $matches)) {
            return ['browser' => 'Opera', 'browser_version' => $matches[1]];
        }

        // Samsung Internet
        if (preg_match('/SamsungBrowser\/([0-9\.]+)/i', $ua, $matches)) {
            return ['browser' => 'Samsung Internet', 'browser_version' => $matches[1]];
        }

        // UC Browser
        if (preg_match('/UCBrowser\/([0-9\.]+)/i', $ua, $matches)) {
            return ['browser' => 'UC Browser', 'browser_version' => $matches[1]];
        }

        // Brave
        if (stripos($ua, 'Brave') !== false) {
            return ['browser' => 'Brave', 'browser_version' => null];
        }

        // Chrome / Chromium
        if (preg_match('/(?:Chrome|CriOS)\/([0-9\.]+)/i', $ua, $matches)) {
            return ['browser' => 'Chrome', 'browser_version' => $matches[1]];
        }

        // Firefox
        if (preg_match('/(?:Firefox|FxiOS)\/([0-9\.]+)/i', $ua, $matches)) {
            return ['browser' => 'Firefox', 'browser_version' => $matches[1]];
        }

        // Safari (must check after Chrome/CriOS/Opera)
        if (preg_match('/Version\/([0-9\.]+).*?Safari/i', $ua, $matches)) {
            return ['browser' => 'Safari', 'browser_version' => $matches[1]];
        }
        if (stripos($ua, 'Safari') !== false && stripos($ua, 'Chrome') === false) {
            return ['browser' => 'Safari', 'browser_version' => null];
        }

        return ['browser' => null, 'browser_version' => null];
    }

    /**
     * Detect device type, brand, and model.
     *
     * @return array{device: string, device_brand: ?string, device_model: ?string}
     */
    protected static function detectDevice(string $ua, ?string $os): array
    {
        // iPad / Tablets
        if (stripos($ua, 'iPad') !== false) {
            return [
                'device' => 'tablet',
                'device_brand' => 'Apple',
                'device_model' => 'iPad',
            ];
        }

        if (stripos($ua, 'Tablet') !== false || (stripos($ua, 'Android') !== false && stripos($ua, 'Mobile') === false)) {
            return [
                'device' => 'tablet',
                'device_brand' => null,
                'device_model' => null,
            ];
        }

        // iPhone / iPod
        if (stripos($ua, 'iPhone') !== false) {
            return [
                'device' => 'mobile',
                'device_brand' => 'Apple',
                'device_model' => 'iPhone',
            ];
        }

        // Mobile Phones
        if (stripos($ua, 'Mobile') !== false || stripos($ua, 'Phone') !== false) {
            $brand = null;
            $model = null;

            if (preg_match('/(Pixel\s*[0-9a-zA-Z\s]+)/i', $ua, $matches)) {
                $brand = 'Google';
                $model = trim($matches[1]);
            } elseif (preg_match('/(SM-[A-Za-z0-9]+)/i', $ua, $matches)) {
                $brand = 'Samsung';
                $model = trim($matches[1]);
            } elseif (stripos($ua, 'Samsung') !== false) {
                $brand = 'Samsung';
            } elseif (stripos($ua, 'Huawei') !== false) {
                $brand = 'Huawei';
            } elseif (stripos($ua, 'Xiaomi') !== false || stripos($ua, 'Redmi') !== false) {
                $brand = 'Xiaomi';
            }

            return [
                'device' => 'mobile',
                'device_brand' => $brand,
                'device_model' => $model,
            ];
        }

        // Desktop OS
        if (in_array($os, ['macOS', 'Windows', 'Linux', 'Ubuntu', 'Fedora', 'Chrome OS'], true)) {
            $brand = $os === 'macOS' ? 'Apple' : null;
            $model = $os === 'macOS' ? 'Mac' : null;

            return [
                'device' => 'desktop',
                'device_brand' => $brand,
                'device_model' => $model,
            ];
        }

        return [
            'device' => 'desktop',
            'device_brand' => null,
            'device_model' => null,
        ];
    }

    /**
     * Extract and sanitize request headers, removing sensitive authentication credentials and cookies.
     *
     * @return array<string, string>
     */
    protected static function extractSafeHeaders(Request|array $request): array
    {
        $sensitiveKeys = [
            'authorization',
            'cookie',
            'set-cookie',
            'x-xsrf-token',
            'x-csrf-token',
            'php-auth-user',
            'php-auth-pw',
            'proxy-authorization',
        ];

        $rawHeaders = $request instanceof Request ? $request->headers->all() : ($request['headers'] ?? []);
        if (! is_array($rawHeaders)) {
            return [];
        }

        $safeHeaders = [];
        foreach ($rawHeaders as $key => $values) {
            $lowerKey = strtolower((string) $key);
            if (in_array($lowerKey, $sensitiveKeys, true)) {
                continue;
            }

            $safeHeaders[$key] = is_array($values) ? implode(', ', $values) : (string) $values;
        }

        return $safeHeaders;
    }
}
