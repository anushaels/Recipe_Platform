const jwt = require('jsonwebtoken');

const JWT_SECRET = "41c80c368f5918c2a0489d529a1ae1a0d4c7f1cd24c48deb22c4786e1a752eaeeeedd4dc35e413662f88ce1eef2ca1479d03f7346a0176b1dd92ec01bddfc220";

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    // Check if Authorization header is provided
    if (!authHeader) {
        console.error("Authorization header missing");
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: "Authorization header missing" }));
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.split(' ')[1];
    if (!token) {
        console.error("Token missing in Authorization header");
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: "Token missing" }));
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("Token verification failed:", err);
            res.writeHead(403, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: "Failed to authenticate token" }));
        }

        // If token is verified successfully, set user ID in the request
        req.userId = decoded.userId;
        next();
    });
}

module.exports = authMiddleware;
