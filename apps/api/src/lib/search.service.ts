import { Injectable, Logger } from '@nestjs/common';
import { env } from '../config/env';

export interface SearchResult {
  url: string;
  title: string;
  snippet: string;
}

/**
 * Web research primitives: Tavily for search, Firecrawl for scraping.
 * Both degrade gracefully when API keys are absent so the pipeline still
 * runs (with thinner context) in local dev.
 */
@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  async search(query: string, maxResults = 5): Promise<SearchResult[]> {
    if (!env.tavilyApiKey) {
      this.logger.warn('TAVILY_API_KEY not set — skipping web search');
      return [];
    }
    try {
      const res = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.tavilyApiKey}`,
        },
        body: JSON.stringify({ query, max_results: maxResults, search_depth: 'basic' }),
      });
      if (!res.ok) throw new Error(`Tavily ${res.status}`);
      const data = (await res.json()) as {
        results?: { url: string; title: string; content: string }[];
      };
      return (data.results ?? []).map((r) => ({
        url: r.url,
        title: r.title,
        snippet: r.content,
      }));
    } catch (err) {
      this.logger.error(`Search failed for "${query}": ${err}`);
      return [];
    }
  }

  /** Scrape a page to markdown. Returns '' on failure — never throws. */
  async scrape(url: string): Promise<string> {
    if (!env.firecrawlApiKey) {
      this.logger.warn('FIRECRAWL_API_KEY not set — skipping scrape');
      return '';
    }
    try {
      const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.firecrawlApiKey}`,
        },
        body: JSON.stringify({ url, formats: ['markdown'] }),
      });
      if (!res.ok) throw new Error(`Firecrawl ${res.status}`);
      const data = (await res.json()) as { data?: { markdown?: string } };
      return (data.data?.markdown ?? '').slice(0, 20000);
    } catch (err) {
      this.logger.error(`Scrape failed for ${url}: ${err}`);
      return '';
    }
  }
}
