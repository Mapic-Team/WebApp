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

/***************************** utility functions *************************/
const rev = ReverseMd5({
  lettersUpper: true,
  lettersLower: true,
  numbers: true,
  special: false,
  whitespace: true,
  maxLen: 20,
});



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


/***************************** CRUD functions *************************/

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
  db.get(md5(userName)).then(function (doc) {
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

//functions for pictureDB

// helper function
function addImg(picId, userName) {
  db.get(md5(userName)).then(function (doc) {
    doc.pictures = doc.pictures.append(picId);
    userDB.put(doc);
  });
}

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
  const randId = Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9*Math.pow(10, 12)).toString(36)
  const pic = {
    _id: randId,
    ownerName: ownerName,
    like: 0,
    tags: tags,
    picBase64: imgBase,
    description: description,
    createdTime: `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()} ${today.getHours()}:${today.getMinutes()}`,
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
  addImg(randId, userName);
}

export function readPicture(pidId) {
  return pictureDB.get(picId);
}


export function updatePicture(
  picId,
  ownerName,
  tags,
  description,
  EXIF
) {
  pictureDB.get(picId).then(function (doc) {
    // Only allow to update the description and tags of the picture
    doc.ownerName = ownerName;
    doc.tags = tags;
    doc.description = description;
    doc.exif = EXIF;
    pictureDB.put(doc);
  });
}

export function deletePicture(pidId) {
  pictureDB.get(pidId).then(function (doc) {
    return pictureDB.remove(doc);
  });
}

// functions for secondary_view

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
 * In the format "yyyy/mm/dd 00:00"
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
	commentTime: "yyyy/mm/dd 00:00" string,
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
 * @param {Int} userId
 * @returns {void}
 */
export function addComment(picId, comment, userName) {
  let today = new Date();
  const comment_profile = {
    commentString: comment,
    commentTime: `${today.getFullYear()}/${
      today.getMonth() + 1
    }/${today.getDate()} ${today.getHours()}:${today.getMinutes()}`,
    commentBy: userName,
  };
  pictureDB.get(picId).then(function (doc) {
    doc.comment.append(comment_profile);
    pictureDB.put(doc);
  });
}

/**
 * Get the description field of a specific picture
 * @param {*} picId
 * @returns
 */
export function getDescription(picId) {
  pictureDB.get(picId).then(function (doc) {
    return doc.description;
  });
}

/**
 * Get the the userName of the owner of a picture
 * @param {*} picId
 * @returns {String}
 */
export function getUser(picId) {
  pictureDB.get(picId).then(function (doc) {
    return ownerName;
  });
}

// functions for mapic homepage

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
