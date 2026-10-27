<p align="center">
    <img src="public/301ping.svg" alt="301 Ping logo" width="360">
</p>

# 301 Ping

301 Ping is a URL shortener for creating, sharing, and organizing compact links. Shorten a URL from the website, a browser extension, or the authenticated API. Registered users can manage their links, organize them with tags, generate QR codes, and track visits.

## Features

### Shorten and share

- Create a short link from the home page without an account, or while signed in.
- Redirect visitors to the original destination and count each visit.
- Return the existing short link when the same destination URL has already been shortened.
- Copy short links to the clipboard from the link library.
- Search your links by destination URL or short slug, filter by tag, and browse paginated results.
- Download a high-resolution PNG QR code for a short link, with the 301 Ping logo embedded in the center.

### Browser extensions

Shorten the current page and copy its short link directly from the browser toolbar:

- [Chrome Web Store](https://chromewebstore.google.com/detail/ms0org-url-shortener/goaddbeloaeledjpkaankdiglhnmpdld)
- [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/301ping-url-shortener/)

### Accounts and link management

- Register and sign in, verify your email, and reset or update your password.
- Manage your profile and delete your account from account settings.
- View your link count and total visits on the dashboard.
- Manage your links: search, filter, copy, tag, download QR codes, and delete.
- Create, search, edit, and delete tags; attach tags to links to keep them organized.
- View visit counts and the most recent visit for each link.

### API access

- Create links programmatically with the authenticated `POST /api/shorten` endpoint.
- Return the existing short link for a destination or create a new one.
- Find the interactive API documentation at [`/documentation/api`](https://301p.ing/documentation/api).
- View, copy, and regenerate the API access token from the dashboard. Regenerating a token invalidates the previous one.

### URL safety

Destinations are validated before shortening. Only HTTP and HTTPS URLs are accepted by default. The application also blocks configured dangerous domains and keywords, private or reserved hosts, and file extensions outside the configured allowlist. See [`config/url_safety.php`](config/url_safety.php) for the current rules.

## Requirements

- PHP 8.4+
- Composer
- Node.js and npm
- MySQL or another database supported by Laravel

## Local development

1. Install PHP and JavaScript dependencies:

    ```sh
    composer install
    npm ci
    ```

2. Create your environment file and application key:

    ```sh
    cp .env.example .env
    php artisan key:generate
    ```

3. Configure the `DB_*` values in `.env` for your local database. The example environment uses MySQL; make sure the database exists, then run migrations:

    ```sh
    php artisan migrate
    ```

4. Start the Laravel server and Vite development server in separate terminals:

    ```sh
    php artisan serve
    ```

    ```sh
    npm run dev
    ```

The app is available at the URL printed by `php artisan serve`. To build production assets, run `npm run build`.

## API

The API requires an account access token from the dashboard. Send it as a bearer token with a JSON `url` to `POST /api/shorten`:

```sh
curl --request POST \
  --url "https://your-domain.example/api/shorten" \
  --header "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{"url":"https://example.com/very/long/url"}'
```

A successful request returns the short URL:

```json
{
    "status": true,
    "message": "Shortened Url created successfully",
    "short_url": "https://your-domain.example/abc123"
}
```

Requests with a missing or invalid token return `401`. Missing, invalid, or unsafe URLs return `422`. See [`/documentation/api`](https://301p.ing/documentation/api) for request and response details.

## Future scope

The following are potential directions for future development, not features currently offered:

- More detailed analytics, such as visits over time and referral or device summaries.
- Custom short slugs and support for customer-owned domains.
- Link controls such as expiration dates, scheduled activation, and pause/resume.
- Bulk link creation and export for larger link libraries.
- Additional browser integrations and API management options.

## Tests

Run the test suite with:

```sh
php artisan test
```
