import {z} from 'zod';
import type {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {docsIndex} from '../docsIndex.js';

export function registerSearchDocs(server: McpServer): void {
  server.registerTool(
    'search_docs',
    {
      description:
        'Search the Pantavisor documentation (docs.pantavisor.io) for pages matching a query. ' +
        'Returns matching page titles, URLs, and a snippet of the matching content.',
      inputSchema: {
        query: z.string().describe('Search terms, e.g. "xconnect networking" or "state.json schema"'),
        limit: z.number().int().min(1).max(20).optional().describe('Max results to return (default 5)'),
      },
    },
    async ({query, limit}) => {
      if (!docsIndex.isReady()) {
        return {
          content: [{type: 'text', text: 'Docs index is still building, try again in a few seconds.'}],
          isError: true,
        };
      }

      const results = docsIndex.searchDocs(query, limit ?? 5);
      if (results.length === 0) {
        return {content: [{type: 'text', text: `No results for "${query}".`}]};
      }

      const text = results
        .map((r) => `## ${r.title}\n${r.url}\n\n${r.snippet}`)
        .join('\n\n---\n\n');
      return {content: [{type: 'text', text}]};
    },
  );
}
