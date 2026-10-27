<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>404 — Page not found</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
    <link href="https://fonts.bunny.net/css?family=manrope:400,500,600,700,800|dm-serif-display:400|jetbrains-mono:400,500,600&display=swap" rel="stylesheet" />

    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">

    @vite(['resources/css/app.css'])
</head>
<body class="bg-paper text-ink antialiased">
    <header class="sticky top-0 z-50 border-b border-line bg-paper">
        <div class="mx-auto flex h-16 max-w-grid items-center justify-between px-6 md:h-[72px] md:px-10 lg:px-16">
            <a href="{{ route('home') }}" class="group flex items-center gap-3" aria-label="Go to 301 ping home page">
                <span class="font-grotesk text-lg font-extrabold tracking-tight text-ink">
                    301<span class="text-accent"> ping</span>
                    <span class="ml-1 hidden align-top text-[11px] font-medium uppercase tracking-[0.18em] text-muted sm:inline">
                        301p.ing
                    </span>
                </span>
            </a>

            <nav class="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
                <a href="{{ route('home') }}" class="font-grotesk text-sm text-muted transition-colors hover:text-ink">Home</a>
                <a href="{{ route('documentation.api') }}" class="font-grotesk text-sm text-muted transition-colors hover:text-ink">API</a>
            </nav>
        </div>
    </header>

    <main class="bg-paper font-grotesk text-ink">
        <section class="border-b border-line" aria-labelledby="not-found-heading">
            <div class="mx-auto max-w-grid px-6 pb-20 pt-16 md:px-10 md:pb-28 md:pt-20 lg:px-16">
                <div class="mb-8 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-muted md:mb-12">
                    <span>404 / Lost route</span>
                    <span class="hidden sm:inline">301p.ing</span>
                </div>

                <div class="grid items-end gap-x-10 gap-y-14 lg:grid-cols-12">
                    <div class="lg:col-span-6">
                        <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-dark">Signal dropped</p>
                        <h1 id="not-found-heading" class="mt-6 font-editorial text-[4.25rem] leading-none text-ink sm:text-7xl lg:text-[8rem]">
                            404
                        </h1>
                    </div>

                    <div class="lg:col-span-6 lg:border-l lg:border-line lg:pl-6">
                        <p class="max-w-md text-lg text-muted">
                            This link has drifted off course, or the page you were looking for was never here in the first place.
                        </p>

                        <div class="mt-8 flex flex-wrap gap-4">
                            <a href="{{ route('home') }}" class="inline-flex items-center justify-center border border-ink bg-ink px-5 py-3 font-grotesk text-sm font-semibold text-paper transition-colors hover:border-accent hover:bg-accent">
                                Back home
                            </a>
                            <a href="{{ route('documentation.api') }}" class="inline-flex items-center justify-center border border-line bg-transparent px-5 py-3 font-grotesk text-sm font-semibold text-ink transition-colors hover:border-ink">
                                API documentation
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="border-b border-line" aria-labelledby="quick-links-heading">
            <div class="mx-auto max-w-grid px-6 py-20 md:px-10 md:py-28 lg:px-16">
                <div class="grid gap-x-10 gap-y-12 lg:grid-cols-12">
                    <div class="lg:col-span-4">
                        <p class="mb-8 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">02 / Quick links</p>
                        <h2 id="quick-links-heading" class="max-w-sm font-grotesk text-4xl leading-[1.05] text-ink sm:text-5xl">
                            Find your way back.
                        </h2>
                    </div>

                    <div class="lg:col-span-8">
                        <div class="grid gap-4 border-t border-line sm:grid-cols-3">
                            <a href="{{ route('home') }}" class="group border-b border-line py-6 sm:border-b-0 sm:border-r sm:pr-6">
                                <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">01</span>
                                <h3 class="mt-4 text-2xl font-semibold text-ink">Home</h3>
                                <p class="mt-3 text-sm leading-relaxed text-muted">Start from the origin and shorten a new URL.</p>
                            </a>

                            <a href="{{ route('links') }}" class="group border-b border-line py-6 sm:border-b-0 sm:border-r sm:pr-6">
                                <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">02</span>
                                <h3 class="mt-4 text-2xl font-semibold text-ink">Links</h3>
                                <p class="mt-3 text-sm leading-relaxed text-muted">Review the URLs you have already created.</p>
                            </a>

                            <a href="{{ route('documentation.api') }}" class="group py-6">
                                <span class="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">03</span>
                                <h3 class="mt-4 text-2xl font-semibold text-ink">API docs</h3>
                                <p class="mt-3 text-sm leading-relaxed text-muted">Read the developer documentation for the service.</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="border-t border-line bg-paper">
        <div class="mx-auto max-w-grid px-6 py-16 md:px-10 md:py-20 lg:px-16">
            <div class="grid grid-cols-1 gap-x-10 gap-y-12 border-b border-line pb-12 lg:grid-cols-12">
                <div class="lg:col-span-6">
                    <p class="max-w-lg font-editorial text-4xl leading-[1.1] text-ink sm:text-5xl">
                        Short links.
                        <br />
                        No noise.
                    </p>
                </div>

                <div class="lg:col-span-3">
                    <h3 class="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Product</h3>
                    <ul class="space-y-3 text-sm font-grotesk">
                        <li><a href="{{ route('home') }}" class="text-ink transition-colors hover:text-accent-dark">Home</a></li>
                        <li><a href="{{ route('documentation.api') }}" class="text-ink transition-colors hover:text-accent-dark">API documentation</a></li>
                        <li><a href="{{ route('privacy') }}" class="text-ink transition-colors hover:text-accent-dark">Privacy policy</a></li>
                    </ul>
                </div>

                <div class="lg:col-span-3">
                    <h3 class="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Account</h3>
                    <ul class="space-y-3 text-sm font-grotesk">
                        <li><a href="{{ route('register') }}" class="text-ink transition-colors hover:text-accent-dark">Register</a></li>
                        <li><a href="{{ route('login') }}" class="text-ink transition-colors hover:text-accent-dark">Login</a></li>
                        <li><a href="https://github.com/msamgan/ms0" class="text-ink transition-colors hover:text-accent-dark">GitHub</a></li>
                    </ul>
                </div>
            </div>

            <div class="flex flex-col items-start justify-between gap-4 pt-8 font-mono text-xs text-muted sm:flex-row sm:items-center">
                <p>© {{ date('Y') }} 301 ping. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>
