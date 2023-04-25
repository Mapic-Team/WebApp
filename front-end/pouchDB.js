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

// functions for mapic homepage

/**
 * Add a new picture to the user's picture list
 * @param {Int} picId
 * @param {Int} userId
 * @returns {void}
 */
function uploadPicture(userId, picId) {
    return null;
}

/**
 * Delete an exist picture from a user's picture list
 * @param {Int} picId
 * @param {Int} userId
 * @returns {void}
 */
function deletePicture(userId, picId) {
    return null;
}

/**
 * Set the location field of a picture object
 * @param {Int} picId
 * @param {Object} location
 * @example
 * location = {latitude,longitude}
 * @returns {void}
 */
function setLocation(picId, location) {
    return null;
}

/**
 * Get the location field of a picture object
 * @param {Int} picId
 * @returns {Object}
 * @example
 * location = {latitude,longitude}
 * @returns {Object} {latitude,longitude}
 */
function getLocation(picId) {
    return null;
}

/**
 * Add a tag string to the tags field of a picture object
 * @param {Int} picId
 * @param {String} tag
 * @returns {void}
 * @example
 * tag = "cat"
 * @returns {void}
 */
function setTag(picId, tag) {
    return null;
}

/**
 * Get the tags field of a picture object
 * @param {Int} picId
 * @returns {Array}
 * @example
 * tags = ["cat", "dog"]
 * @returns {Array} ["cat", "dog"]
 */
function getAllTags(picId) {
    return null;
}

/**
 * Set the EXIF field of a picture object
 * @param {Int} picId
 * @param {Object} EXIF
 * @example
 * EXIF = {time, location, exposure_time, aperture, iso}
 * time: "yyyy/mm/dd 00:00" String
 * location: {latitude, longitude} Object
 * exposure_time: "1/1000" String
 * aperture: "f/1.8" String
 * iso: 100 Int
 * @returns {void}
 */
function setEXIF(picId, EXIF) {
    return null;
}

/**
 * Get the EXIF field of a picture object
 * @param {Int} picId
 * @returns {Object}
 * @example
 * EXIF = {time, location, exposure_time, aperture, iso}
 * @returns {Object} {time, location, exposure_time, aperture, iso}
 */
function getEXIF(picId) {
    return null;
}

// Some functions needs to be exported, 
// others like readUser and updateUser which act as helper functions remain private.

exports.increaseLike = increaseLike;
exports.addComment = addComment;
exports.readDescription = readDescription;
exports.getUser = getUser;