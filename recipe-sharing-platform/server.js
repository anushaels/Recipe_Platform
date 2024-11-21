const http = require('http');
const connectDB = require('./config/db');
const setupAuthRoutes = require('./routes/authRoutes');
const setupRecipeRoutes = require('./routes/recipeRoutes');

connectDB().then(db => {
    const server = http.createServer((req, res) => {
        // Set CORS headers for all requests
        res.setHeader('Access-Control-Allow-Origin', '*'); // Allows all origins (for development)
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Include OPTIONS for preflight
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // Handle preflight (OPTIONS) requests
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        let data = '';
        
        req.on('data', chunk => {
            data += chunk;
        });

        req.on('end', () => {
            console.log(`Request received: Method=${req.method}, URL=${req.url}`);
            
            try {
                if (data) req.body = JSON.parse(data);
                res.setHeader('Content-Type', 'application/json');

                // Authentication and recipe routes
                if (req.url === '/register' || req.url === '/login') {
                    setupAuthRoutes(req, res, db);
                } else if (req.url.startsWith('/recipes')) {
                    setupRecipeRoutes(req, res, db);
                } else {
                    res.writeHead(404).end(JSON.stringify({ error: 'Route not found' }));
                }
            } catch (err) {
                console.error('Error handling request:', err);
                res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'Invalid JSON format' }));
            }
        });

        req.on('error', (err) => {
            console.error('Request error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'Internal Server Error' }));
        });
    });

    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => console.log("Database connection failed", err));
