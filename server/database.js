import { MongoClient } from "mongodb";
import md5 from "md5";

const connectionString =
  "mongodb+srv://Barricature:wTz63sS8Nv7uECS0@cluster0.pmk22hf.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(connectionString);
await client.connect();

class Database {
  constructor() {
    const database = client.db("Mapic_database");
    this.db = database;
    this.userDB = database.collection("userDB");
    this.pictureDB = database.collection("pictureDB");
  }
  /***************************** utility functions *************************/

/**
 * Helper function
 * Given a picId and the user that created it,
 * append the picId to the end of the pictures array of that specific user
 * in the user database
 * @param {String} picId
 * @param {String} userName
 * @return {boolean} 
 */
async #addPic(picId, userName) {
  try {
    const user = await this.userDB.findOne({ _id: md5(userName) });
    if (user) {
      const picArray = user.pictures;
      picArray.push(picId);
      await this.userDB.updateOne(
        { _id: md5(userName) },
        {
          $set: {
            pictures: picArray,
          },
        }
      );
      return true;
    }
  } catch (error) {
    console.log(`Error occurred while adding picture ${picId} to user ${userName}: ${error}`);
  }
  return false;
}


  async #removePic(picId, userName) {
    const user = await this.userDB.findOne({ _id: md5(userName) });
    const picArray = user.pictures;
    picArray.remove(picId);
    const result = await this.userDB.updateOne(
      { _id: md5(userName) },
      {
        $set: {
          pictures: picArray,
        },
      }
    );
  }

  /**
   * Helper function
   * Generates a random ID
   * @return {Int} with length of 16-17
   */
  #randId() {
    return (
      Date.now().toString(36) +
      Math.floor(
        Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)
      ).toString(36)
    );
  }

  /**
   * Helper function
   * Remove all pictures that belong to a user and return an array of deleted picture IDs
   * @param {String} userName
   * @returns {Promise<Array>} Array of deleted picture IDs
   */
  async #deleteAllPic(userName) {
    try {
      const deletedPictures = await this.pictureDB.find({ ownerName: userName }).toArray();
      const deletedPictureIds = deletedPictures.map(picture => picture._id);
      await this.pictureDB.deleteMany({ ownerName: userName });
      console.log(`Deleted all pictures for user ${userName}.`);
      return deletedPictureIds;
    } catch (error) {
      console.error(`Error occurred while deleting pictures for user ${userName}: ${error}`);
      return [];
    }
  }


  /***************************** userDB CRUD functions *************************/

  /**
   * Creates a user with userName and password
   * @param {String} userName
   * @param {String} password
   * @returns {Object} {success: boolean, message: string}
   */
  async createUser(userName, password) {
    const obj = {success: false, message: ""};
    const user = {
      _id: md5(userName),
      userName: userName,
      password: password,
      pictures: [],
    };
    try {
      const result = await this.userDB.insertOne(user);
      obj.message = `Added user ${userName} with ID ${result.insertedId}.`;
      obj.success = true;
    } catch (error) {
      //duplicate key
      if (error.code === 11000) {
        obj.message = `User ${userName} already exists.`;
        obj.success = false;
      } else {
        obj.message = `Error occured while inserting: ${error}, user ${userName} not added.`;
        obj.success = false;
      }
    }
    console.log(obj.message);
    return obj;
  }

  /**
   * Read all user information given a userName
   * @param {String} userName
   * @returns {Object} {success: boolean, message: string, data: obj}
   */
  async readUser(userName) {
    const obj = { success: false, message: "", data: null };
    try {
      const result = await this.userDB.findOne({ _id: md5(userName) });
      if (result) {
        obj.success = true;
        obj.message = "User found.";
        obj.data = result;
      } else {
        obj.message = `User ${userName} not found.`;
      }
    } catch (error) {
      obj.message = `Error occurred while reading user: ${error}`;
    }
    console.log(obj.message);
    return obj;
  }

/**
 * Remove a user from the database and remove all pertaining information
 * Will also delete all pictures from the database
 * @param {*} userName
 * @returns {Object} { success: boolean, message: string }
 */
async deleteUser(userName) {
  const obj = { success: false, message: "" };
  try {
    const result = await this.userDB.deleteOne({ _id: md5(userName) });
    if (result.deletedCount === 1) {
      const deletedPictureIds = await this.#deleteAllPic(userName); // delete all pictures from the database
      if (deletedPictureIds.length > 0) {
        obj.success = true;
        obj.message = `Deleted user ${userName}. Removed pictures:`;
        deletedPictureIds.forEach(pictureId => {
          obj.message += `${pictureId} `;
        });
      } else {
        obj.message = `Deleted user ${userName}. No pictures found for deletion.`;
      }
    } else {
      obj.message = `User ${userName} not found.`;
    }
  } catch (error) {
    obj.message = `Error occurred while deleting user: ${error}`;
  }
  console.log(obj.message);
  return obj;
}


  /***************************** pictureDB CRUD functions *************************/

/**
 * Create a picture
 * Must be created with all fields present
 * Note that this function could allow for duplicate picture insertion
 * @param {String} ownerName
 * @param {String} imgBase
 * @param {Array} tags
 * @param {String} description
 * @param {Object} EXIF
 * @returns {Object} { success: boolean, message: string }
 */
async createPicture(ownerName, imgBase, tags, description, EXIF) {
  const obj = { success: false, message: "" };
  const Id = this.#randId(); // very unique generation, length 16-17
  const pic = {
    _id: Id,
    ownerName: ownerName,
    like: 0,
    tags: tags,
    picBase64: imgBase,
    description: description,
    createdTime: new Date(),
    exif: EXIF,
    comments: [],
  };
  try {
    const addPicResult = await this.#addPic(Id, ownerName);
    if (addPicResult) {
      const result = await this.pictureDB.insertOne(pic);
      obj.success = true;
      obj.message = `Added picture ${Id}.`;
      console.log(obj.message);
    } else { // Case when add pic failed, usually due to user not exist
      obj.message = `Failed to add picture ${Id} to user ${ownerName}.`;
      console.log(obj.message);
    }
  } catch (error) {
    obj.message = `Error occurred while inserting: ${error}, picture ${Id} not added.`;
    console.log(obj.message);
  }
  return obj;
}


  /**
   * Get all information pertaining to the picture
   * @param {String} picId
   * @returns {Object}
   */
  async readPicture(picId) {
    const result = await this.pictureDB.findOne({ _id: picId });
    return result;
  }

  /**
   * Delete a picture from the pictureDB,
   * also delete it from its owner's pictures array
   * @param {String} picId
   * @returns {void}
   */
  async deletePicture(picId) {
    const userName = await this.pictureDB.findOne({ _id: md5(picId) })
      .ownerName;
    await this.#removePic(picId, userName);
    const result = await this.pictureDB.deleteOne({ _id: md5(picId) });
    console.log(`Deleted picture ${picId}`);
  }

  /***************************** r/w functions for secondary_view *************************/

  /**
   * Increase the likes of a specific picture in the database by one.
   * @param {String} picId
   * @param {Int} change a positive or negative number that the like will change by
   * @returns {void}
   */
  async changeLikeBy(picId, change) {
    const result = await this.pictureDB.updateOne(
      { _id: md5(picId) },
      {
        $inc: {
          like: change,
        },
      }
    );
  }

  /**
   * Add a new comment by a user to a picture
   * @param {String} picId
   * @param {String} comment the new comment that is being added
   * @param {String} userName
   * @returns {void}
   */
  async addComment(picId, comment, userName) {
    const comment_profile = {
      commentString: comment,
      commentTime: constructTimeString(),
      commentBy: userName,
    };
    const commentArray = await this.pictureDB.findOne({ _id: md5(picId) })
      .comments;
    commentArray.push(comment_profile);
    const result = await this.pictureDB.updateOne(
      { _id: md5(picId) },
      {
        $set: {
          comments: commentArray,
        },
      }
    );
  }

  /**
   * Get the three most liked photos created within three days
   * If there are less than three photos created within three days, get up to three most liked photos from all time
   * @return {Array<Object>}
   */
  async getTrending() {
    const currentDate = new Date();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(currentDate.getDate() - 3);

    //most liked from within three days
    const pipeline = [
      {
        $match: {
          createdTime: {
            $gte: threeDaysAgo,
            $lte: currentDate,
          },
        },
      },
      { $sort: { like: -1 } },
      { $limit: 3 },
      {
        $project: {
          picBase64: 1,
        },
      },
    ];

    const result = await collection.aggregate(pipeline).toArray();
    const numResults = result.length;

    // If there aren't enough photos
    if (numResults < 3) {
      const remainingCount = 3 - numResults;

      const additionalPipeline = [
        { $sort: { like: -1 } },
        { $limit: remainingCount },
        {
          $project: {
            picBase64: 1,
          },
        },
      ];

      const additionalResult = await collection
        .aggregate(additionalPipeline)
        .toArray();
      result.push(...additionalResult);
    }

    return result;
  }

  /**
   * Get ten most common tags
   * @return {Array<String>}
   */
  async getTenMostCommonTags() {
    const pipeline = [
      { $unwind: "$tags" },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ];
    const result = await collection.aggregate(pipeline).toArray();
    const commonTags = result.map((entry) => entry._id);
    return commonTags;
  }

  /***************************** r/w functions for Mapic (homepage) *****************************/

  /***************************** r/w functions for profile page *****************************/

  /**
   * Get the most popular pic of a user
   * return null if the user has no pictures
   * @param {*} userName
   * @return {Object} return the whole picture object
   */
  async getMostLikedPic(userName) {
    console.log('entered function')
    const picArray = await this.userDB.findOne({ _id: md5(userName) }).pictures;
    const mostLikedPic = null;
    console.log("picArray");
    console.log(picArray);
    picArray.reduce(async (acc, e) => {
      const pic = await this.pictureDB.findOne({ _id: md5(e) });
      if (pic.like > acc) {
        mostLikedPic = pic;
        return pic.like;
      }
      return acc;
    }, 0);
    return mostLikedPic;
  }

  /**
   * Update the settings of a user
   * @param {String} userName
   * @param {Object} newSetting
   * @return {void}
   */
  async updateSetting(userName,newSetting) {}
}
//TODO updateDescription(userName,newDescription) and updateProfilePicture(userName,newProfilePicture)
const database = new Database();

export { database };
