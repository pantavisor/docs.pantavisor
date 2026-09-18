import {z} from 'zod';
import type {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {docsIndex} from '../docsIndex.js';

export function registerFetchPage(server: McpServer): void {
  server.registerTool(
    'fetch_page',
    {
      title: 'Fetch Pantavisor docs page',
      description:
        'Fetch the full raw markdown content of a page on https://docs.pantavisor.io by its site path ' +
        '(e.g. "/pantavisor/overview/xconnect"), as returned by search_docs. ' +
        'Read-only: it only retrieves published documentation and changes nothing.',
      annotations: {
        title: 'Fetch Pantavisor docs page',
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
      inputSchema: {
        path: z.string().describe('Site-relative path of the page, e.g. "/pantavisor/overview"'),
      },
    },
    async ({path}) => {
      const markdown = await docsIndex.fetchPageMarkdown(path);
      if (markdown === null) {
        return {
          content: [{type: 'text', text: `No page found at "${path}".`}],
          isError: true,
        };
      }
      return {content: [{type: 'text', text: markdown}]};
    },
  );
}
