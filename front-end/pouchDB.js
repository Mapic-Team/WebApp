// This file should handle all reading and writing realted to the database
// It should export functions that all three pages (mapic, profile, and secondary_view, and read)
// The functions need not be async for now

const PouchDB = require("pouchdb");
const md5 = require("md5");
const ReverseMd5 = require("reverse-md5");
const rev = ReverseMd5({
  lettersUpper: true,
  lettersLower: true,
  numbers: true,
  special: false,
  whitespace: true,
  maxLen: 20,
});

const pictureDB = new PouchDB("pictureDB");
const userDB = new PouchDB("userDB");

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
 *
 * @param {String} userName
 * @param {String} password
 * @returns {void}
 */
function createUser(userName, password) {
  let user = {
    _id: md5(userName),
    userName: userName,
    password: password,
    userPicture: getImgBase64("front-end/resources/default_user_picture.png"),
    userDescription: "I am new to Mapic!",
    userSetting: { isVisible: true, isDarkMode: false },
  };
  userDB.put(user, function (err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log("User Created");
    }
  });
}
function readUser(userName) {
  return userDB.get(md5(userName));
}

function updateUser(
  oldUserName,
  newUserName,
  password,
  path,
  description,
  userSetting
) {
  db.get(md5(oldUserName)).then(function (doc) {
    // Update the document
    doc._id = md5(newUserName);
    doc.userName = newUserName;
    doc.password = password;
    doc.userPicture = getImgBase64(path);
    doc.userDescription = description;
    doc.userSetting = userSetting;

    // Save the updated document
    userDB.put(doc);
  });
}

function deleteUser(userName) {
  userDB.get(md5(userName)).then(function (doc) {
    userDB.remove(doc);
  });
}

//functions for pictureDB
/**
 *
 * @param {String} userName
 * @param {String} imgBase
 * @param {String} description
 * @param {String} longitude
 * @param {String} latitude
 * @param {Object} EXIF
 * @returns {void}
 */
function createPicture(
  userName,
  imgBase,
  description,
  longitude,
  latitude,
  EXIF
) {
  let today = new Date();
  let pic = {
    _id: md5(imgBase) + md5(userName),
    picBase64: imgBase,
    picDescription: description,
    picLike: 0,
    picComment: [],
    picDate: `${today.getFullYear()}/${
      today.getMonth() + 1
    }/${today.getDate()} ${today.getHours()}:${today.getMinutes()}`,
    picTags: [],
    picLocation: { longitude: longitude, latitude: latitude },
    picEXIF: EXIF,
  };
  pictureDB.put(pic, function (err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log("Picture Created");
    }
  });
}

function readPicture(userName, imgBase) {
  return pictureDB.get(md5(imgBase) + md5(userName));
}

function updatePicture(
  userName,
  imgBase,
  description,
  tags,
  longitude,
  latitude,
  EXIF
) {
  pictureDB.get(md5(imgBase) + md5(userName)).then(function (doc) {
    // Only allow to update the description and tags of the picture
    doc.picDescription = description;
    doc.picTag = tags;
    doc.picLocation.longitude = longitude;
    doc.picLocation.latitude - latitude;
    doc.EXIF = EXIF;
    pictureDB.put(doc);
  });
}

function deletePicture(userName, imgBase) {
  pictureDB.get(md5(imgBase) + md5(userName)).then(function (doc) {
    return pictureDB.remove(doc);
  });
}

// functions for secondary_view

/**
 * This function increase the likes of a specific picture in the database by one.
 * @param {Int} picId
 * @returns {void}
 */
function increaseLike(picId) {
  pictureDB.get(picId).then(function (doc) {
    doc.picLike += 1;
    pictureDB.put(doc);
  });
}

/**
 * This function decrease the likes of a specific picture in the database by one.
 * @param {Int} picId
 * @returns {void}
 */
function decreaseLike(picId) {
  pictureDB.get(picId).then(function (doc) {
    doc.picLike -= 1;
    pictureDB.put(doc);
  });
}

/**
 * Get the time field from exif of a specific picture, return the time as a string
 * In the format "yyyy/mm/dd 00:00"
 * @param {*} picId
 * @returns {String}
 */
function getPicTime(picId) {
  pictureDB.get(picId).then(function (doc) {
    return doc.picDate;
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
function getComments(picId) {
  pictureDB.get(picId).then(function (doc) {
    return doc.picComment;
  });
}

/**
 * This function add a new comment by a user to a picture
 * @param {String} picId
 * @param {String} comment the new comment that is being added
 * @param {Int} userId
 * @returns {void}
 */
function addComment(picId, comment, userId) {
  let today = new Date();
  const comment_profile = {
    commentString: comment,
    commentTime: `${today.getFullYear()}/${
      today.getMonth() + 1
    }/${today.getDate()} ${today.getHours()}:${today.getMinutes()}`,
    commentBy: userId,
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
function getDescription(picId) {
  pictureDB.get(picId).then(function (doc) {
    return doc.picDescription;
  });
}

/**
 * Get the the user id of the owner of a picture
 * @param {*} picId
 * @returns {String}
 */
function getUser(picId) {
  return rev(picId.slice(picId / 2)).str;
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
function getLocation(picId) {
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
function getAllTags(picId) {
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
function getEXIF(picId) {
  pictureDB.get(picId).then(function (doc) {
    return doc.picEXIF;
  });
}

// Some functions needs to be exported,
// others like readUser and updateUser which act as helper functions remain private.

exports.increaseLike = increaseLike;
exports.addComment = addComment;
exports.readDescription = readDescription;
exports.getUser = getUser;
