import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const N8N_WEBHOOK_URL =
    process.env.N8N_WEBHOOK_URL ||
    'https://vedaksharichukka.app.n8n.cloud/webhook/a78d993b-b405-4856-9dbc-15ec6ced158c/chat';

  app.use(express.json());

  // Proxy route to n8n webhook (handles CORS & protocol normalization)
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, chatInput, sessionId, context } = req.body;
      const textToSend = message || chatInput || '';

      // n8n Chat Trigger nodes commonly accept { chatInput: "...", sessionId: "..." } or { message: "..." }
      const payload = {
        chatInput: textToSend,
        message: textToSend,
        sessionId: sessionId || 'default-session',
        context: context || {},
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        // Extract message from standard n8n chat response formats:
        // { output: "text" }, { text: "text" }, { message: "text" }, or array [{ text: "..." }]
        let botReply = '';
        if (typeof data === 'string') {
          botReply = data;
        } else if (Array.isArray(data) && data.length > 0) {
          botReply = data[0].output || data[0].text || data[0].message || JSON.stringify(data[0]);
        } else if (data && typeof data === 'object') {
          botReply = data.output || data.text || data.message || data.response || data.reply || (data.data ? JSON.stringify(data.data) : JSON.stringify(data));
        } else {
          botReply = String(data);
        }
        return res.json({ reply: botReply, raw: data });
      } else {
        const textData = await response.text();
        return res.json({ reply: textData });
      }
    } catch (err: any) {
      console.error('Error forwarding chat to n8n webhook:', err);
      return res.status(500).json({
        error: 'Failed to contact n8n assistant',
        details: err?.message || 'Unknown network error',
      });
    }
  });

  // Health route
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', n8nConfigured: Boolean(N8N_WEBHOOK_URL) });
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // In dev, attach Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
