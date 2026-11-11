<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    @php($seo = $page['props']['seo'] ?? null)
    <title inertia>{{ $seo ? $seo['title'] . ' - 301 ping' : config('app.name', '301 ping') }}</title>

    @if($seo)
        <meta name="description" content="{{ $seo['description'] }}" head-key="description">
        <meta name="robots" content="index,follow,max-image-preview:large" head-key="robots">
        <link rel="canonical" href="{{ $seo['canonicalUrl'] }}" head-key="canonical">
        <meta property="og:type" content="{{ $seo['type'] }}" head-key="og:type">
        <meta property="og:site_name" content="301 Ping" head-key="og:site_name">
        <meta property="og:locale" content="en_US" head-key="og:locale">
        <meta property="og:title" content="{{ $seo['title'] }}" head-key="og:title">
        <meta property="og:description" content="{{ $seo['description'] }}" head-key="og:description">
        <meta property="og:url" content="{{ $seo['canonicalUrl'] }}" head-key="og:url">
        <meta property="og:image" content="{{ $seo['image'] }}" head-key="og:image">
        <meta property="og:image:alt" content="{{ $seo['imageAlt'] }}" head-key="og:image:alt">
        <meta name="twitter:card" content="summary_large_image" head-key="twitter:card">
        <meta name="twitter:title" content="{{ $seo['title'] }}" head-key="twitter:title">
        <meta name="twitter:description" content="{{ $seo['description'] }}" head-key="twitter:description">
        <meta name="twitter:image" content="{{ $seo['image'] }}" head-key="twitter:image">
        <meta name="twitter:image:alt" content="{{ $seo['imageAlt'] }}" head-key="twitter:image:alt">
        @if($seo['structuredData'])
            <script type="application/ld+json" head-key="structured-data">@json($seo['structuredData'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT)</script>
        @endif
    @endif

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
    <link
        rel="preload"
        as="style"
        href="https://fonts.bunny.net/css?family=figtree:400,500,600|manrope:400,500,600,700,800|dm-serif-display:400|jetbrains-mono:400,500,600&display=swap"
        onload="this.onload=null;this.rel='stylesheet'">
    <noscript>
        <link
            href="https://fonts.bunny.net/css?family=figtree:400,500,600|manrope:400,500,600,700,800|dm-serif-display:400|jetbrains-mono:400,500,600&display=swap"
            rel="stylesheet">
    </noscript>

    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">

    @include('partials.umami')
    @include('partials.google-tag-manager')

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
    @paddleJS
</head>
<body class="font-sans antialiased bg-gray-100">
@inertia
</body>
</html>
