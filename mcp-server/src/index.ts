import express from 'express';
import {rateLimit} from 'express-rate-limit';
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StreamableHTTPServerTransport} from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {hostHeaderValidation} from '@modelcontextprotocol/sdk/server/middleware/hostHeaderValidation.js';
import {docsIndex} from './docsIndex.js';
import {registerSearchDocs} from './tools/searchDocs.js';
import {registerFetchPage} from './tools/fetchPage.js';

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? '0.0.0.0';
// Set to the ingress hostname so the SDK's DNS-rebinding-protection
// middleware still applies even though we bind to 0.0.0.0 in the container.
const ALLOWED_HOSTS = (process.env.ALLOWED_HOSTS ?? 'mcp.docs.pantavisor.io').split(',');
// Number of reverse proxies in front of the pod (the nginx ingress), so the
// rate limiter keys on the real client IP from X-Forwarded-For rather than
// the ingress pod's IP.
const TRUST_PROXY_HOPS = Number(process.env.TRUST_PROXY_HOPS ?? 1);
// Per-client budget for the unauthenticated /mcp endpoint. A Claude turn is
// a handful of requests (initialize, tools/list, a few tools/call), so this
// is generous for real use while capping abuse.
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX ?? 120);

function buildServer(): McpServer {
  const server = new McpServer({
    name: 'pantavisor-docs',
    version: '1.0.0',
    websiteUrl: 'https://docs.pantavisor.io',
    // Shown next to the server name in MCP client UIs (e.g. Claude's
    // connectors list). Served by this same docs site.
    icons: [{src: 'https://docs.pantavisor.io/img/favicon.png', mimeType: 'image/png'}],
  });
  registerSearchDocs(server);
  registerFetchPage(server);
  return server;
}

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', TRUST_PROXY_HOPS);
app.use(express.json());

// express.json() rejects malformed bodies by throwing; without this handler
// Express would answer with its default HTML error page instead of JSON-RPC.
app.use((err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'status' in err && err.status === 400) {
    res.status(400).json({jsonrpc: '2.0', error: {code: -32700, message: 'Parse error: invalid JSON'}, id: null});
    return;
  }
  next(err);
});

// Host validation and rate limiting only guard /mcp: k8s liveness/readiness
// probes hit /healthz directly by pod IP, with no Host header matching the
// public ingress hostname, so it must stay outside these checks.
app.use('/mcp', hostHeaderValidation(ALLOWED_HOSTS));
app.use(
  '/mcp',
  rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS,
    limit: RATE_LIMIT_MAX,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {jsonrpc: '2.0', error: {code: -32000, message: 'Too many requests, retry later.'}, id: null},
  }),
);

app.get('/healthz', (_req, res) => {
  if (!docsIndex.isReady()) {
    res.status(503).send('index not ready');
    return;
  }
  res.status(200).send(`ok (${docsIndex.pageCount()} pages indexed)`);
});

// Stateless: a fresh McpServer + transport per request, no session store to
// keep in sync across replicas.
app.post('/mcp', async (req, res) => {
  const server = buildServer();
  try {
    const transport = new StreamableHTTPServerTransport({sessionIdGenerator: undefined});
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
    res.on('close', () => {
      transport.close();
      server.close();
    });
  } catch (err) {
    console.error('Error handling MCP request:', err);
    if (!res.headersSent) {
      res.status(500).json({jsonrpc: '2.0', error: {code: -32603, message: 'Internal server error'}, id: null});
    }
  }
});

for (const method of ['get', 'delete'] as const) {
  app[method]('/mcp', (_req, res) => {
    res.status(405).json({jsonrpc: '2.0', error: {code: -32000, message: 'Method not allowed.'}, id: null});
  });
}

async function main(): Promise<void> {
  await docsIndex.refresh();
  docsIndex.startBackgroundRefresh();

  app.listen(PORT, HOST, () => {
    console.log(`docs-mcp-server listening on ${HOST}:${PORT} (${docsIndex.pageCount()} pages indexed)`);
  });
}

main().catch((err) => {
  console.error('Failed to start docs-mcp-server:', err);
  process.exit(1);
});
