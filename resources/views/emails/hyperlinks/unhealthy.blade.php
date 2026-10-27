<x-mail::message>
# Hyperlink Health Alert

Your hyperlink destination URL has been detected as unhealthy.

**Short Link:** {{ $hyperlink->shot_slug }}  
**Destination URL:** {{ $hyperlink->url }}  
**Health Status:** {{ ucfirst($hyperlink->health instanceof \App\Enums\Health ? $hyperlink->health->value : (string) $hyperlink->health) }}

Please check and update your destination URL if needed.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
