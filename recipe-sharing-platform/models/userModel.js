const bcrypt = require('bcryptjs');

const createUser = async (db, email, password, username) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection('users').insertOne({ email, password: hashedPassword, username });
};


const findUserByEmail = async (db, email) => {
    return db.collection('users').findOne({ email });
};

module.exports = { createUser, findUserByEmail };
