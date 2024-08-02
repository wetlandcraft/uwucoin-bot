const Datastore = require('nedb');
const db = new Datastore({ filename: './database/UwUChain.db', autoload: true });

// Function to add a user if not exists
function addUserIfNotExists(userId, initialBalance = 0.00) {
    return new Promise((resolve, reject) => {
        db.findOne({ userId }, (err, doc) => {
            if (err) {
                reject(err);
            } else if (!doc) {
                // If user not found, create a new entry with initial balance
                db.insert({ userId, balance: initialBalance }, (err, newDoc) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(newDoc);
                    }
                });
            } else {
                resolve(doc);
            }
        });
    });
}

// Function to update user balance
function updateUserBalance(userId, amount) {
    return new Promise((resolve, reject) => {
        db.update({ userId }, { $set: { balance: amount } }, {}, (err, numUpdated) => {
            if (err) {
                reject(err);
            } else {
                resolve(numUpdated);
            }
        });
    });
}

// Function to get user's balance
function getUserBalance(userId) {
    return new Promise((resolve, reject) => {
        db.findOne({ userId }, (err, doc) => {
            if (err) {
                reject(err);
            } else if (!doc) {
                reject(new Error('User not found'));
            } else {
                resolve(doc.balance);
            }
        });
    });
}

module.exports = {
    addUserIfNotExists,
    updateUserBalance,
    getUserBalance
};