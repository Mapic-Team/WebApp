// This file should handle all reading and writing realted to the database
// It should export functions that all three pages (mapic, profile, and secondary_view, and read)
// The functions need not be async for now

const PouchDB = require("pouchdb");
const md5 = require("md5");

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
  user = {
    userId: md5(userName),
    userName: userName,
    password: password,
    userPicture: getImgBase64("front-end/resources/default_user_picture.png"),
    userDescription: "I am new to Mapic!",
    userSetting: { isVisible: true },
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
  return null;
}

// Some functions needs to be exported,
// others like readUser and updateUser which act as helper functions remain private.

exports.increaseLike = increaseLike;
exports.addComment = addComment;
exports.readDescription = readDescription;
exports.getUser = getUser;
