const { createUser, findUserByEmail } = require('../models/userModel');
const { generateToken } = require('../utils/jwtUtils');
const bcrypt = require('bcryptjs');

const register = async (req, res, db) => {
    try {
        const { email, password, username } = req.body; 
        console.log("Registering user:", email);

        const existingUser = await findUserByEmail(db, email);
        if (existingUser) {
            return res.writeHead(400, {'Content-Type': 'application/json'}).end(JSON.stringify({ error: "User already exists" }));
        }

        await createUser(db, email, password, username); 
        res.writeHead(201, {'Content-Type': 'application/json'}).end(JSON.stringify({ message: "User registered" }));
    } catch (err) {
        console.error("Error during registration:", err);
        res.writeHead(500, {'Content-Type': 'application/json'}).end(JSON.stringify({ error: "Internal Server Error" }));
    }
};


const login = async (req, res, db) => {
    try {
        const { email, password } = req.body;
        console.log("Logging in user:", email);

        const user = await findUserByEmail(db, email);
        if (user && await bcrypt.compare(password, user.password)) {
            const token = generateToken(user._id);
            res.writeHead(200, {'Content-Type': 'application/json'}).end(JSON.stringify({ token }));
        } else {
            res.writeHead(401, {'Content-Type': 'application/json'}).end(JSON.stringify({ error: "Invalid credentials" }));
        }
    } catch (err) {
        console.error("Error during login:", err);
        res.writeHead(500, {'Content-Type': 'application/json'}).end(JSON.stringify({ error: "Internal Server Error" }));
    }
};

module.exports = { register, login };
