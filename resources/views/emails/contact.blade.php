<x-mail::message>
# New contact request

**Name:** {{ $data['name'] }}  
**Email:** {{ $data['email'] }}  
**Phone:** {{ $data['country_code'] }} {{ $data['phone'] }}

**Message:**

{{ $data['message'] }}
</x-mail::message>
