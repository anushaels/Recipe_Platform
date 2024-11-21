const recipeController = require('../controllers/recipeController');
const authMiddleware = require('../middleware/authMiddleware');

function setupRecipeRoutes(req, res, db) {
    if (req.method === 'POST' && req.url === '/recipes') {
        authMiddleware(req, res, () => recipeController.addRecipe(req, res, db));
    }
    else if (req.method === 'GET' && req.url.startsWith('/recipes/')) {
        const id = req.url.split('/')[2];
        recipeController.fetchRecipeById(req, res, db, id);
    }
    else if (req.method === 'GET' && req.url.startsWith('/recipes')) {
        recipeController.getRecipeList(req, res, db);
    }
    // Handle PUT request to update a recipe by ID
    else if (req.method === 'PUT' && req.url.startsWith('/recipes/')) {
        const id = req.url.split('/')[2];
        authMiddleware(req, res, () => recipeController.updateRecipeById(req, res, db, id));
    }
    // Handle DELETE request to delete a recipe by ID
    else if (req.method === 'DELETE' && req.url.startsWith('/recipes/')) {
        const id = req.url.split('/')[2];
        authMiddleware(req, res, () => recipeController.deleteRecipeById(req, res, db, id));
    } 
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: "Route not found" }));
    }
}

module.exports = setupRecipeRoutes;
