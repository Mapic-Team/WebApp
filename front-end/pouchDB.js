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
    userDB.put(user, function(err, res) {
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

/**
 * This function increase the likes of a specific picture in the database by one.
 * @param {Int} picId 
 * @returns {void}
 */
function increaseLike(picId) {
    return null;
    // read picture
    // increase the like field
    // update picture
}

/**
 * This function decrease the likes of a specific picture in the database by one.
 * @param {Int} picId 
 * @returns {void}
 */
function decreaseLike(picId) {
    return null
}

/**
 * Get the time field from exif of a specific picture, return the time as a string
 * In the format "yyyy/mm/dd 00:00"
 * @param {*} picId 
 * @returns {String} 
 */
function getPicTime(picId) {
    return null
}

/**
 * Get all comments of a picture, return an array of comment objects in the form
 * {commentString: “”, string
	commentTime: "yyyy/mm/dd 00:00" string,
	commentBy: int (userId)}
 * @param {*} picId 
 * @return {Array} returns an array of comment objects
 */
function getComments(picId) {
    return null
}
/**
 * This function add a new comment by a user to a picture
 * @param {Int} picId
 * @param {String} comment the new comment that is being added
 * @param {Int} userId
 * @returns {void}
 */
function addComment(picId, comment, userId) {
    return null;
}

/**
 * Get the description field of a specific picture
 * @param {*} picId 
 * @returns 
 */
function getDescription(picId) {
    return null;
}

/**
 * Get the the user id of the owner of a picture
 * @param {*} picId 
 * @returns {Int}
 */
function getUser(picId) {
    return null
}


// Some functions needs to be exported, 
// others like readUser and updateUser which act as helper functions remain private.

exports.increaseLike = increaseLike;
exports.addComment = addComment;
exports.getDescription = getDescription;
exports.getUser = getUser;