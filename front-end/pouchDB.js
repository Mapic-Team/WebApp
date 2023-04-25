// This file should handle all reading and writing realted to the database
// It should export functions that all three pages (mapic, profile, and secondary_view, and read)
// The functions need not be async for now

var PouchDB = require('pouchdb');

const pictureDB = new PouchDB('pictureDB');
const userDB = new PouchDB('userDB');

/**
 * 
 * @param {String} userName 
 * @param {String} password
 * @returns {void}
 */
function createUser(userName, password) {
    user = {
        userName: userName,
        password: password
    }
    db.put(user, function(err, res) {
        if(err) {
            console.log(err);
        } else {
            console.log('User Created')
        }
    });
}

function readUser() {
    return null;
}

function updateUser() {
    return null;
}

function deleteUser() {
    return null;
}


// functions for secondary_view

function increaseLike(userName) {
    return null;
}

function addComment(picId) {
    return null;
}

function readDescription(picId) {
    return null;
}

function getUser(picId) {
    return null
}


// Some functions needs to be exported, 
// others like readUser and updateUser which act as helper functions remain private.

exports.increaseLike = increaseLike;
exports.addComment = addComment;
exports.readDescription = readDescription;
exports.getUser = getUser;