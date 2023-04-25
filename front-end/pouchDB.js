// This file should handle all reading and writing realted to the database
// It should export functions that all three pages (mapic, profile, and secondary_view, and read)
// The functions need not be async for now

// const PouchDB = require("pouchdb");
// const md5 = require("md5");
// const ReverseMd5 = require("reverse-md5");

import PouchDB from "pouchdb";
import md5 from "md5";
import ReverseMd5 from "reverse-md5";

// Creates twp databases
const pictureDB = new PouchDB("pictureDB");
const userDB = new PouchDB("userDB");

const rev = ReverseMd5({
  lettersUpper: true,
  lettersLower: true,
  numbers: true,
  special: false,
  whitespace: true,
  maxLen: 20,
});

/***************************** utility functions *************************/

function getImgBase64(path) {
  const file = path;
  const reader = new FileReader();

  reader.onload = function () {
    const base64Image = reader.result.split(",")[1];
    console.log(base64Image);
    return base64Image;
  };

  reader.readAsDataURL(file);
}


/**
 * Given a picId and the user that created it,
 * append the picId to the end of the pictures array of that specific user
 * in the user database
 * @param {String} picId 
 * @param {String} userName 
 * @return {void}
 */
function addPic(picId, userName) {
  userDB.get(md5(userName)).then(function (doc) {
    doc.pictures = doc.pictures.append(picId);
    userDB.put(doc);
  });
}

/**
 * Given a picId and the user that created it,
 * remove the picId from pictures array of that specific user
 * in the user database
 * @param {String} picId 
 * @param {String} userName 
 * @return {void}
 */
function removePic(picId, userName) {
  userDB.get(md5(userName)).then(function (doc) {
    doc.pictures = doc.pictures.remove(picId);
    userDB.put(doc);
  });
}

/**
 * Return the date and time when the function is called
 * In the format 
 * @return {String}
 */
function constructTimeString() {
  let y = today.getFullYear().toString();
  let m = (today.getMonth() + 1).toString().padStart(2, '0');
  let d = today.getDate().toString().padStart(2, '0');
  let hour = today.getHours().toString().padStart(2, '0');
  let min = today.getMinutes().toString().padStart(2, '0');
  let sec = today.getSeconds().toString().padStart(2, '0');
  return `${y}:${m}:${d} ${hour}:${min}:${sec}`;
}

/**
 * Generate a random unique id string of length 16-17
 * should be used for generating picId
 * @returns {String}
 */
function randId() {
  return Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9*Math.pow(10, 12)).toString(36);
}

/***************************** userDB CRUD functions *************************/

/**
 * Creates a user given userName and password
 * Sets other parameters to default: profilePicture, profileDescription, settings
 * @param {String} userName
 * @param {String} password
 * @returns {void}
 */
export function createUser(userName, password) {
  let user = {
    _id: md5(userName),
    userName: userName,
    password: password,
    profilePicture: getImgBase64("front-end/resources/default_user_picture.png"),
    profileDescription: "I am new to Mapic!",
    settings: { isVisible: true, isDarkMode: false },
    pictures: []
  };
  userDB.put(user, function (err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log("User Created");
    }
  });
}

/**
 * Read all user information given a userName
 * @param {String} userName 
 * @returns {Object}
 */
export function readUser(userName) {
  return userDB.get(md5(userName));
}

/**
 * Update all fields of a user
 * @param {String} userName
 * @param {String} password 
 * @param {String} profileDescription 
 * @param {String} profilePicture
 * @param {Object} userSetting 
 * @param {Array} pictures an array of picture ids
 * @returns {void}
 */
export function updateUser(
  userName,
  password,
  profileDescription,
  profilePicturePath,
  userSetting,
  pictures
) {
  userDB.get(md5(userName)).then(function (doc) {
    // Update the document
    doc.password = password;
    doc.profileDescription = profileDescription;
    doc.profilePicture = getImgBase64(profilePicturePath);
    doc.settings = userSetting;
    doc.pictures = pictures;
    // Save the updated document
    userDB.put(doc);
  });
}

/**
 * Remove a user from the database and remove all pertaining information
 * @param {*} userName 
 * @returns {void}
 */
export function deleteUser(userName) {
  userDB.get(md5(userName)).then(function (doc) {
    userDB.remove(doc);
  });
}

/***************************** pictureDB CRUD functions *************************/

/**
 * create a picture
 * must be created with all fields present
 * @param {String} ownerName
 * @param {String} imgBase
 * @param {Array} tags
 * @param {String} description
 * @param {Object} EXIF
 * @returns {void}
 */
export function createPicture(
  ownerName,
  imgBase,
  tags,
  description,
  EXIF
) {
  const today = new Date();
  // very unique generation, length 16-17
  const Id = randId();
  const pic = {
    _id: Id,
    ownerName: ownerName,
    like: 0,
    tags: tags,
    picBase64: imgBase,
    description: description,
    createdTime: constructTimeString(),
    exif: EXIF,
    comments: [],
  };
  pictureDB.put(pic, function (err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log("Picture Created");
    }
  });
  // add the picture under the user
  addPic(Id, userName);
}

/**
 * Get all information pertaining to the picture
 * @param {String} pidId 
 * @returns {Object}
 */
export function readPicture(pidId) {
  return pictureDB.get(picId);
}

/**
 * Update a picture's tags and description and exif fields
 * @param {*} picId 
 * @param {*} tags 
 * @param {*} description 
 * @param {*} EXIF 
 */
export function updatePicture(
  picId,
  tags,
  description,
  EXIF
) {
  pictureDB.get(picId).then(function (doc) {
    // Only allow to update the description and tags of the picture
    doc.tags = tags;
    doc.description = description;
    doc.exif = EXIF;
    pictureDB.put(doc);
  });
}

/**
 * Delete a picture from the pictureDB,
 * also delete it from its owner's pictures array
 * @param {String} picId 
 * @returns {void}
 */
export function deletePicture(picId) {
  let userName = '';
  pictureDB.get(picId).then(function (doc) {
    userName = doc.ownerName;
    return pictureDB.remove(doc);
  });
  removePic(picId, userName);
}

/***************************** r/w functions for secondary_view *************************/

/**
 * This export function increase the likes of a specific picture in the database by one.
 * @param {Int} picId
 * @returns {void}
 */
export function increaseLike(picId) {
  pictureDB.get(picId).then(function (doc) {
    doc.like += 1;
    pictureDB.put(doc);
  });
}

/**
 * This export function decrease the likes of a specific picture in the database by one.
 * @param {Int} picId
 * @returns {void}
 */
export function decreaseLike(picId) {
  pictureDB.get(picId).then(function (doc) {
    doc.like -= 1;
    pictureDB.put(doc);
  });
}

/**
 * Get the time field from exif of a specific picture, return the time as a string
 * In the format "yyyy:mm:dd hh:mm:ss"
 * @param {*} picId
 * @returns {String}
 */
export function getPicTime(picId) {
  pictureDB.get(picId).then(function (doc) {
    return doc.createdTime;
  });
}

/**
 * Get all comments of a picture, return an array of comment objects in the form
 * {commentString: “”, string
	commentTime: "yyyy:mm:dd hh:mm:ss" string,
	commentBy: int (userId)}
 * @param {*} picId 
 * @return {Array} returns an array of comment objects
 */
export function getComments(picId) {
  pictureDB.get(picId).then(function (doc) {
    return doc.comments;
  });
}

/**
 * This export function add a new comment by a user to a picture
 * @param {String} picId
 * @param {String} comment the new comment that is being added
 * @param {String} userName
 * @returns {void}
 */
export function addComment(picId, comment, userName) {
  let today = new Date();
  const comment_profile = {
    commentString: comment,
    commentTime: constructTimeString(),
    commentBy: userName,
  };
  pictureDB.get(picId).then(function (doc) {
    doc.comment.append(comment_profile);
    pictureDB.put(doc);
  });
}

/**
 * Get the description field of a specific picture
 * @param {String} picId
 * @returns
 */
export function getDescription(picId) {
  pictureDB.get(picId).then(function (doc) {
    return doc.description;
  });
}

/**
 * Get the the userName of the owner of a picture
 * @param {String} picId
 * @returns {String}
 */
export function getUser(picId) {
  pictureDB.get(picId).then(function (doc) {
    return ownerName;
  });
}

/***************************** r/w functions for Mapic (homepage) *****************************/

/**
 * Get the location field of a picture object
 * @param {String} picId
 * @returns {Object}
 * @example
 * location = {latitude,longitude}
 * @returns {Object} {latitude,longitude}
 */
export function getLocation(picId) {
  pictureDB.get(picId).then(function (doc) {
    return doc.picLocation;
  });
}

/**
 * Get the tags field of a picture object
 * @param {String} picId
 * @returns {Array}
 * @example
 * tags = ["cat", "dog"]
 * @returns {Array} ["cat", "dog"]
 */
export function getAllTags(picId) {
  pictureDB.get(picId).then(function (doc) {
    return doc.picTags;
  });
}

/**
 * Get the EXIF field of a picture object
 * @param {String} picId
 * @returns {Object}
 * @example
 * EXIF = {time, location, exposure_time, aperture, iso}
 * @returns {Object} {time, location, exposure_time, aperture, iso}
 */
export function getEXIF(picId) {
  pictureDB.get(picId).then(function (doc) {
    return doc.picEXIF;
  });
}

