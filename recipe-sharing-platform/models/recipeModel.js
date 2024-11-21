const { ObjectId } = require('mongodb');

// Add a new recipe
const createRecipe = async (db, recipe) => {
    try {
        console.log("Inserting recipe:", recipe);
        const result = await db.collection('recipes').insertOne(recipe);
        console.log("Recipe inserted:", result);
        return result;
    } catch (error) {
        console.error('Error inserting recipe:', error);
        throw error;
    }
};

// Get recipes with optional filtering, pagination, and sorting
const getRecipes = async (db, filter = {}, page = 1, limit = 3) => {
    const skip = (page - 1) * limit;

    try {
        return await db.collection('recipes')
            .find(filter)
            .skip(skip)
            .limit(limit)
            .toArray();
    } catch (error) {
        console.error("Error fetching recipes:", error);
        throw error;
    }
};


// Get a recipe by ID
const getRecipeById = async (db, id) => {
    return db.collection('recipes').findOne({ _id: new ObjectId(id) });
};

// Update a recipe by ID
const updateRecipe = async (db, id, updatedRecipe) => {
    try {
        return await db.collection('recipes').updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedRecipe }
        );
    } catch (error) {
        console.error("Error updating recipe:", error);
        throw error;
    }
};

// Delete a recipe by ID
const deleteRecipe = async (db, id) => {
    try {
        return await db.collection('recipes').deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
        console.error("Error deleting recipe:", error);
        throw error;
    }
};

module.exports = { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe };
