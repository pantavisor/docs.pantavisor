import MiniSearch from 'minisearch';

const DOCS_ORIGIN = process.env.DOCS_ORIGIN ?? 'https://docs.pantavisor.io';
const REFRESH_INTERVAL_MS = 60 * 60 * 1000;

// Old/RC/development builds are served under a version-prefixed path
// (e.g. /029-rc5/..., /development/...) and are near-duplicates of the
// root version's content — docusaurus.config.ts already marks them
// noIndex for the same reason, so the sitemap should already omit them.
// This regex is a second line of defense against ever indexing them.
const VERSION_SEGMENT = /^(development|\d{3}(-rc\d+(\.\d+)?)?)$/;

interface DocPage {
  url: string;
  title: string;
  content: string;
}

export interface SearchResult {
  url: string;
  title: string;
  snippet: string;
}

class DocsIndex {
  private search: MiniSearch<DocPage> | null = null;
  private pagesByPath = new Map<string, DocPage>();
  private ready = false;

  isReady(): boolean {
    return this.ready;
  }

  pageCount(): number {
    return this.pagesByPath.size;
  }

  async refresh(): Promise<void> {
    const urls = await fetchSitemapUrls();
    const pages = await Promise.all(urls.map(fetchPage));

    const search = new MiniSearch<DocPage>({
      idField: 'url',
      fields: ['title', 'content'],
      storeFields: ['url', 'title', 'content'],
      // A term in the page title should outweigh body-text frequency, so a
      // query like "xconnect networking" ranks the page titled "Pantavisor
      // xconnect" above pages that merely mention networking a lot.
      searchOptions: {boost: {title: 3}, prefix: true},
    });

    const byPath = new Map<string, DocPage>();
    for (const page of pages) {
      if (!page) continue;
      search.add(page);
      byPath.set(new URL(page.url).pathname, page);
    }

    this.search = search;
    this.pagesByPath = byPath;
    this.ready = true;
  }

  startBackgroundRefresh(): void {
    setInterval(() => {
      this.refresh().catch((err) => {
        console.error('docs index refresh failed, keeping previous index', err);
      });
    }, REFRESH_INTERVAL_MS);
  }

  searchDocs(query: string, limit: number): SearchResult[] {
    if (!this.search) return [];
    return this.search.search(query).slice(0, limit).map((result) => ({
      url: result.url,
      title: result.title,
      snippet: snippetFor(result.content as string, query),
    }));
  }

  async fetchPageMarkdown(path: string): Promise<string | null> {
    const normalized = normalizePath(path);
    const cached = this.pagesByPath.get(normalized);
    if (cached) return cached.content;

    // Not in the index (e.g. it was filtered, or the index is stale) —
    // fall back to a direct fetch so fetch_page still works for any
    // valid same-origin doc path.
    const page = await fetchPage(new URL(normalized, DOCS_ORIGIN).toString());
    return page?.content ?? null;
  }
}

export const docsIndex = new DocsIndex();

async function fetchSitemapUrls(): Promise<string[]> {
  const res = await fetch(`${DOCS_ORIGIN}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml fetch failed: ${res.status}`);
  const xml = await res.text();

  const urls: string[] = [];
  for (const match of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
    const url = match[1];
    const pathname = new URL(url).pathname;
    const firstSegment = pathname.split('/').filter(Boolean)[0] ?? '';
    if (VERSION_SEGMENT.test(firstSegment)) continue;
    urls.push(url);
  }
  return urls;
}

async function fetchPage(pageUrl: string): Promise<DocPage | null> {
  const markdownUrl = toMarkdownUrl(pageUrl);
  try {
    const res = await fetch(markdownUrl);
    if (!res.ok) return null;
    const content = await res.text();
    return {url: pageUrl, title: titleFromMarkdown(content) ?? pageUrl, content};
  } catch {
    return null;
  }
}

function toMarkdownUrl(pageUrl: string): string {
  const url = new URL(pageUrl);
  const path = url.pathname === '/' || url.pathname === '' ? '/index' : url.pathname.replace(/\/$/, '');
  url.pathname = `${path}.md`;
  return url.toString();
}

function normalizePath(path: string): string {
  // Strip any leading slashes before re-adding exactly one: a path starting
  // with "//" would otherwise resolve as protocol-relative against an
  // arbitrary host when passed to `new URL(path, origin)` below, turning
  // fetch_page into an open proxy.
  const stripped = path.replace(/^\/+/, '');
  const withSlash = `/${stripped}`;
  return withSlash.replace(/\/$/, '') || '/';
}

function titleFromMarkdown(content: string): string | undefined {
  const heading = content.match(/^#\s+(.+)$/m);
  return heading?.[1].trim();
}

function snippetFor(content: string, query: string, radius = 160): string {
  const lower = content.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return content.slice(0, radius * 2).trim();
  let start = Math.max(0, idx - radius);
  let end = Math.min(content.length, idx + query.length + radius);
  // Snap the window to word boundaries so the snippet never opens or closes
  // mid-word (e.g. "…ples" for "pv-examples").
  if (start > 0) {
    while (start > 0 && !/\s/.test(content[start - 1])) start--;
  }
  if (end < content.length) {
    while (end < content.length && !/\s/.test(content[end])) end++;
  }
  return `${start > 0 ? '…' : ''}${content.slice(start, end).trim()}${end < content.length ? '…' : ''}`;
}
