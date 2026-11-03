<?php

namespace App\Services;

use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use League\CommonMark\Environment\Environment;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;
use League\CommonMark\Extension\FrontMatter\Data\SymfonyYamlFrontMatterParser;
use League\CommonMark\Extension\FrontMatter\FrontMatterExtension;
use League\CommonMark\Extension\FrontMatter\FrontMatterParser;
use League\CommonMark\Extension\GithubFlavoredMarkdownExtension;
use League\CommonMark\MarkdownConverter;
use Throwable;

class BlogService
{
    public function path(): string
    {
        return base_path('content/blog');
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function all(): Collection
    {
        if (! File::isDirectory($this->path())) {
            return collect();
        }

        return collect(File::files($this->path()))
            ->filter(fn ($file) => $file->getExtension() === 'md')
            ->map(fn ($file) => $this->parse($file->getPathname(), $file->getFilenameWithoutExtension(), false))
            ->filter()
            ->filter(fn (array $post) => ! $post['draft'])
            ->sortByDesc('timestamp')
            ->values();
    }

    /**
     * @return array<string, mixed>|null
     */
    public function find(string $slug): ?array
    {
        $post = $this->all()->firstWhere('slug', $slug);

        return $post === null ? null : $this->parse($post['file'], pathinfo($post['file'], PATHINFO_FILENAME), true);
    }

    /**
     * @return array<string, mixed>|null
     */
    private function parse(string $path, string $filename, bool $withBody): ?array
    {
        try {
            $raw = File::get($path);
            $parsed = $this->frontMatterParser()->parse($raw);
            $meta = is_array($parsed->getFrontMatter()) ? $parsed->getFrontMatter() : [];
            $markdown = $parsed->getContent();
            $date = CarbonImmutable::parse($meta['date'] ?? File::lastModified($path));
        } catch (Throwable) {
            return null;
        }

        $title = (string) ($meta['title'] ?? Str::headline($filename));
        $description = (string) ($meta['description'] ?? Str::limit(trim(strip_tags($markdown)), 160));
        $words = str_word_count(strip_tags($markdown));

        $post = [
            'file' => $path,
            'slug' => (string) ($meta['slug'] ?? Str::slug($filename)),
            'title' => $title,
            'description' => $description,
            'image' => $this->absoluteUrl($meta['image'] ?? null),
            'image_alt' => (string) ($meta['image_alt'] ?? $title),
            'author' => (string) ($meta['author'] ?? config('app.name')),
            'tags' => array_values(array_map('strval', (array) ($meta['tags'] ?? []))),
            'draft' => (bool) ($meta['draft'] ?? false),
            'date' => $date->toIso8601String(),
            'date_formatted' => $date->format('F j, Y'),
            'updated' => isset($meta['updated']) ? CarbonImmutable::parse($meta['updated'])->toIso8601String() : $date->toIso8601String(),
            'reading_time' => max(1, (int) ceil($words / 200)),
            'timestamp' => $date->getTimestamp(),
        ];

        if ($withBody) {
            $post['html'] = $this->converter()->convert($markdown)->getContent();
        }

        return $post;
    }

    private function absoluteUrl(mixed $image): ?string
    {
        if (! $image) {
            return null;
        }

        $image = (string) $image;

        return Str::startsWith($image, ['http://', 'https://'])
            ? $image
            : rtrim(config('app.url'), '/') . '/' . ltrim($image, '/');
    }

    private function frontMatterParser(): FrontMatterParser
    {
        return new FrontMatterParser(new SymfonyYamlFrontMatterParser);
    }

    private function converter(): MarkdownConverter
    {
        $environment = new Environment([
            'html_input' => 'strip',
            'allow_unsafe_links' => false,
        ]);
        $environment->addExtension(new CommonMarkCoreExtension);
        $environment->addExtension(new GithubFlavoredMarkdownExtension);
        $environment->addExtension(new FrontMatterExtension);

        return new MarkdownConverter($environment);
    }
}
