const { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe } = require('../models/recipeModel');

// Add a new recipe
const addRecipe = async (req, res, db) => {
    try {
        const { title, ingredients, instructions, cuisine, cookingTime, imageUrl } = req.body;

        // Ensure all required fields are present
        if (!title || !ingredients || !instructions || !cuisine || !cookingTime || !imageUrl) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: "Missing required fields" }));
        }

        // Attempt to insert the recipe directly
        const newRecipe = { title, ingredients, instructions, cuisine, cookingTime, imageUrl };
        const result = await db.collection('recipes').insertOne(newRecipe);

        // Check for successful insertion
        if (result.acknowledged && result.insertedId) {
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Recipe created successfully" }));
        } else {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Failed to create recipe" }));
        }
    } catch (error) {
        console.error('Error inserting recipe:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Internal server error" }));
    }
};



// Get a list of recipes with exact filtering by cuisine and cookingTime
const getRecipeList = async (req, res, db) => {
    try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const cuisine = url.searchParams.get('cuisine');
        const cookingTime = url.searchParams.get('cookingTime');
        const page = parseInt(url.searchParams.get('page')) || 1;
        const limit = parseInt(url.searchParams.get('limit')) || 10;

        const filter = {};
        if (cuisine) filter.cuisine = cuisine;
        if (cookingTime) filter.cookingTime = parseInt(cookingTime);

        console.log("Filter being used:", filter);

        // Total count of recipes for pagination
        const totalRecipes = await db.collection('recipes').countDocuments(filter);
        const totalPages = Math.ceil(totalRecipes / limit);

        // Fetch recipes based on filters, page, and limit
        const recipes = await getRecipes(db, filter, page, limit);

        // If no recipes match, respond with 404
        if (!recipes || recipes.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: "No recipes found matching the filters" }));
        }

        // Respond with the filtered list of recipes and pagination info
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            recipes,
            pagination: {
                totalRecipes,
                totalPages,
                currentPage: page,
                pageSize: limit
            }
        }));
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Internal server error" }));
    }
};


// Get a recipe by ID
const fetchRecipeById = async (req, res, db, id) => {
    try {
        const recipe = await getRecipeById(db, id);

        if (!recipe) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: "Recipe not found" }));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(recipe));
    } catch (error) {
        console.error('Error fetching recipe by ID:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Internal server error" }));
    }
};

// Update a recipe by ID
const updateRecipeById = async (req, res, db, id) => {
    try {
        const { title, ingredients, instructions, cuisine, cookingTime, imageUrl } = req.body;

        // Ensure at least one field is present for the update
        if (!title && !ingredients && !instructions && !cuisine && !cookingTime && !imageUrl) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: "At least one field is required for update" }));
        }

        // Build the update object dynamically
        const updatedRecipe = {};
        if (title) updatedRecipe.title = title;
        if (ingredients) updatedRecipe.ingredients = ingredients;
        if (instructions) updatedRecipe.instructions = instructions;
        if (cuisine) updatedRecipe.cuisine = cuisine;
        if (cookingTime) updatedRecipe.cookingTime = parseInt(cookingTime);
        if (imageUrl) updatedRecipe.imageUrl = imageUrl;

        const result = await updateRecipe(db, id, updatedRecipe);

        if (result.matchedCount === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: "Recipe not found" }));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Recipe updated successfully" }));
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Internal server error" }));
    }
};

// Delete a recipe by ID
const deleteRecipeById = async (req, res, db, id) => {
    try {
        const result = await deleteRecipe(db, id);

        if (result.deletedCount === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: "Recipe not found" }));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Recipe deleted successfully" }));
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Internal server error" }));
    }
};


module.exports = { addRecipe, getRecipeList,fetchRecipeById, updateRecipeById, deleteRecipeById };
