
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = "41c80c368f5918c2a0489d529a1ae1a0d4c7f1cd24c48deb22c4786e1a752eaeeeedd4dc35e413662f88ce1eef2ca1479d03f7346a0176b1dd92ec01bddfc220"; 

function generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' }); 
}

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function comparePasswords(inputPassword, storedPassword) {
    return await bcrypt.compare(inputPassword, storedPassword);
}

module.exports = { generateToken, hashPassword, comparePasswords };
