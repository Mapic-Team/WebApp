import { database } from "./database.js";
import { userdata } from "./testUserData.js";
import { picdata } from "./testImgData.js";

async function add(name, p) {
  database.createUser(name, p);
}
async function addpic(name, img, tags, de, exif) {
  database.createPicture(name, img, tags, de, exif);
}

// userdata.map(async (user) => {
//   if (database.readUser(user.userName) !== null) {
//     await add(user.userName, user.password);
//   }
// });

picdata.map(async (pic) => {
  if (database.readPicture(pic.picId) !== null) {
    database.createPicture(
      pic.ownerName,
      pic.picBase64,
      pic.tags,
      pic.description,
      pic.exif
    );
  }
});
