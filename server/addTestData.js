import { database } from "./database.js";
import { userdata } from "./testUserData.js";
import { picdata } from "./testImgData.js";
import md5 from "md5";

userdata.map((user) => {
  database.createUser(user.userName, user.password);
});

picdata.map((pic) => {
  database.createPicture(
    pic.ownerName,
    pic.picBase64,
    pic.tags,
    pic.description,
    pic.exif
  );
});
