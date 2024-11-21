// routes/authRoutes.js
const authController = require('../controllers/authController');  // This imports register and login

function setupAuthRoutes(req, res, db) {
    if (req.method === 'POST' && req.url === '/register') {
        authController.register(req, res, db);  
    } else if (req.method === 'POST' && req.url === '/login') {
        authController.login(req, res, db);  
    } else {
        res.writeHead(404, {'Content-Type': 'application/json'}).end(JSON.stringify({ error: "Route not found" }));
    }
}

module.exports = setupAuthRoutes;
