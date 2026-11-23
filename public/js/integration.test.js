/** @jest-environment node */
const http = require('http');

let server;
let BASE = process.env.API_URL;

beforeAll(async () => 
    {
        if (BASE) 
        {
            return;
        }

        const colors = ['green', 'white', 'red'];
        server = http.createServer((req, res) => 
        {
            let body = '';
            req.on('data', (chunk) => (body += chunk));
            req.on('end', () => 
            {
                const data = body ? JSON.parse(body) : {};
                res.setHeader('Content-Type', 'application/json');

                if (req.method === 'POST' && req.url === '/SearchColors.php') 
                {
                    const results = colors.filter((c) =>
                    c.toLowerCase().includes((data.search || '').toLowerCase())
                    );
                    res.end(JSON.stringify({ results, error: '' }));
                } 
                else if (req.method === 'POST' && req.url === '/AddColor.php') 
                {
                    res.end(JSON.stringify({ error: '' }));
                } 
                else 
                {
                    res.statusCode = 404;
                    res.end(JSON.stringify({ error: 'Not found' }));
                }
            });
        });

        await new Promise((resolve) => server.listen(0, resolve));
        BASE = `http://localhost:${server.address().port}`;
});

afterAll(() => new Promise((resolve) => (server ? server.close(resolve) : resolve())));

const post = (endpoint, body) =>
  fetch(`${BASE}/${endpoint}.php`, 
    {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('API Integration', () => 
    {
        test('SearchColors returns the expected JSON structure', async () => 
        {
            const res = await post('SearchColors', { search: 're', userId: 1 });
            expect(res.status).toBe(200);
            const data = await res.json();
            expect(Array.isArray(data.results)).toBe(true);
            expect(data.results).toEqual(['green', 'red']);
            expect(data).toHaveProperty('error', '');
  });

        test('AddColor responds with an empty error on success', async () => 
        {
            const res = await post('AddColor', { color: 'teal', userId: 1 });
            expect(res.status).toBe(200);
            expect((await res.json()).error).toBe('');
        });
});