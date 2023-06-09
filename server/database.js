import { MongoClient } from "mongodb";
import { default_pic } from "./default_profile_pic.js";
import md5 from "md5";

const connectionString = null; // Change this to connection string otherwise won't work

const client = new MongoClient(connectionString);
await client.connect();

class Database {
  constructor() {
    const database = client.db("Mapic");
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

  /**
   * 
   * @param {*} picId 
   * @param {*} userName 
   * @returns {Promise<boolean>}
   */
  async #removePic(picId, userName) {
    try {
      const user = await this.userDB.findOne({ _id: md5(userName) });
      const picArray = user.pictures;
      const index = picArray.indexOf(picId);
      if (index !== -1) {
        picArray.splice(index, 1);
        await this.userDB.updateOne(
          { _id: md5(userName) },
          {
            $set: {
              pictures: picArray,
            },
          }
        );
        return true;
      } else {
        console.log(`Picture ${picId} not found in user ${userName}'s pictures.`);
      }
    } catch (error) {
      console.log(`Error occurred while removing picture ${picId} from user ${userName}: ${error}`);
    }
    return false;
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
      profilePicture: default_pic,
      settings:{}
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
   * 
   * @param {String} picId 
   * @returns {Obj} { success: boolean, message: string, data: obj }
   */
  async readPicture(picId) {
    const obj = { success: false, message: "", data: null };
    try {
      const result = await this.pictureDB.findOne({ _id: picId });
      if (result) {
        obj.success = true;
        obj.message = "Picture found.";
        obj.data = result;
      } else {
        obj.message = `Picture ${picId} not found.`;
      }
    } catch (error) {
      obj.message = `Error occurred while reading picture: ${error}`;
    }
    console.log(obj.message);
    return obj;
  }
   /**
    * Get all pictures from the databse
    * @returns {Promise<Object>}{ success: boolean, message: string, data: Array<pictures>}
    */
  async readAllPictures() {
    const obj = { success: false, message: "", data: null };
    // let result = await this.pictureDB.find().toArray();
    try {
      const result = await this.pictureDB.find().toArray();
      if (result) {
        obj.success = true;
        obj.message = "Read all pictures.";
        obj.data = result;
      } else {
        obj.message = `No pictures found.`;
      }
    } catch (error) {
      obj.message = `Error occurred while reading pictures: ${error}`;
    }
    console.log(obj.message);
    return obj;
  }

  /**
   * read One random picture from the database
   * @returns {Promise<Object>} { success: boolean, message: string, data: picture}
   */
  async readOnePicture() {
    const obj = { success: false, message: "", data: null };
    try {
      const count = await this.pictureDB.countDocuments();
      if (count === 0) {
        obj.message = "No pictures found.";
        return obj;
      }
      const randomIndex = Math.floor(Math.random() * count);
      const result = await this.pictureDB.findOne({}, { skip: randomIndex });
      if (result) {
        obj.success = true;
        obj.message = "Read one picture.";
        obj.data = result;
      } else {
        obj.message = "No pictures found.";
      }
    } catch (error) {
      obj.message = `Error occurred while reading a picture: ${error}`;
    }
    console.log(obj.message);
    return obj;
  }
  
  /**
   * Delete a picture from the pictureDB,
   * also delete it from its owner's pictures array
   * picture will be deleted even if the owner is not found
   * @param {String} picId
   * @returns {Object} { success: boolean, message: string }
   */
  async deletePicture(picId) {
    const obj = { success: false, message: "" };
    try {
      const picture = await this.pictureDB.findOne({ _id: picId });
      if (!picture) {
        obj.message = `Picture ${picId} not found.`;
        console.log(obj.message);
        return obj;
      }
      const userName = picture.ownerName;
      const removePicSuccess = await this.#removePic(picId, userName);
      const result = await this.pictureDB.deleteOne({ _id: md5(picId) });
      console.log(`Deleted picture ${picId}`);
      obj.success = true;
      if (removePicSuccess) {
        obj.message = `Deleted picture ${picId} from user ${userName}.`;
      } else {
        obj.message = `Deleted picture ${picId} successfully. Owner ${userName} not found.`;
      }
    } catch (error) {
      obj.message = `Error occurred while deleting picture ${picId}: ${error}`;
    }
    console.log(obj.message);
    return obj;
  }
  

  /***************************** r/w functions for secondary_view *************************/

  /**
   * Increase the likes of a specific picture in the database by one.
   * @param {String} picId
   * @param {Int} change a positive or negative number that the like will change by
   * @returns {Object} { success: boolean, message: string }
   */
  async changeLikeBy(picId, change) {
    const obj = { success: false, message: "" };
    // Check if 'change' parameter is an integer
    if (!Number.isInteger(change)) {
      obj.message = "Change in like must be an integer.";
      return obj;
    }
    try {
      const result = await this.pictureDB.updateOne(
        { _id: picId },
        {
          $inc: {
            like: change,
          },
        }
      );
      // Check if the picture is found and modified
      if (result.matchedCount === 1 && result.modifiedCount === 1) {
        const picture = await this.pictureDB.findOne({ _id: picId });
        const like = picture.like;
        obj.success = true;
        obj.message = `Picture ${picId} now has ${like} likes.`;
      } else {
        obj.message = `Picture ${picId} not found.`;
      }
    } catch (error) {
      obj.message = `Error occurred while changing like for picture ${picId}: ${error}`;
    }
    console.log(obj.message);
    return obj;
  }


  /**
   * Add a new comment by a user to a picture
   * will not add if either the user or the picture is not found
   * @param {String} picId
   * @param {String} comment the new comment that is being added
   * @param {String} userName
   * @returns {Object} { success: boolean, message: string }
   */
  async addComment(picId, comment, userName) {
    const obj = { success: false, message: "" };

    try {
      // Check if the picture exists
      const picture = await this.pictureDB.findOne({ _id: picId });
      if (!picture) {
        obj.message = `Picture ${picId} not found.`;
        return obj;
      }

      // Check if the user exists
      const user = await this.userDB.findOne({ _id: md5(userName) });
      if (!user) {
        obj.message = `User ${userName} not found.`;
        return obj;
      }

      const comment_profile = {
        commentString: comment,
        commentTime: new Date(),
        commentBy: userName,
      };

      const commentArray = picture.comments;
      commentArray.push(comment_profile);

      const result = await this.pictureDB.updateOne(
        { _id: picId },
        {
          $set: {
            comments: commentArray,
          },
        }
      );

      if (result.modifiedCount === 1) {
        obj.success = true;
        obj.message = `Comment added successfully to picture ${picId}.`;
      } else {
        obj.message = `Failed to add comment to picture ${picId}.`;
      }
    } catch (error) {
      obj.message = `Error occurred while adding comment to picture ${picId}: ${error}`;
    }

    console.log(obj.message);
    return obj;
  }


  /**
   * Get the three most liked photos created within three days
   * only returns the picId and imgBase field
   * If there are less than three photos created within three days, get up to three most liked photos from all time
   * @return {Object} { success: boolean, message: string, data: Array<Object> }
   */
  async getTrending() {
    const obj = { success: false, message: "", data: [] };

    try {
      const currentDate = new Date();
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(currentDate.getDate() - 3);

      // Query pipeline for most liked photos from within three days
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

      const result = await this.pictureDB.aggregate(pipeline).toArray();
      const numResults = result.length;

      // If there aren't enough photos within three days, fetch from all time
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

        const additionalResult = await this.pictureDB
          .aggregate(additionalPipeline)
          .toArray();
        result.push(...additionalResult);
      }

      obj.success = true;
      obj.message = "Trending photos retrieved successfully.";
      obj.data = result;
    } catch (error) {
      obj.message = `Error occurred while retrieving trending photos: ${error}`;
    }

    console.log(obj.message);
    return obj;
  }


  /**
   * Get ten most common tags among all pictures
   * @return {Object} { success: boolean, message: string, data: Array<String> }
   */
  async getTenMostCommonTags() {
    const obj = { success: false, message: "", data: null };
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
    try {
      const result = await this.pictureDB.aggregate(pipeline).toArray();
      const commonTags = result.map((entry) => entry._id);
      obj.message = "";
      obj.success = true;
      obj.data = commonTags;
    } catch(error) {
      obj.message = `Error occured while retrieving common tags: ${error}`;
    }
    console.log(obj.message);
    return obj;
  }

  /**
   * Given a string, match up to ten tags that contains the given string
   * @param {String} input 
   * @return {Promise<Object>} { success: boolean, message: string, data: Array<String> }
   */
  async matchTags(input) {
    const obj = { success: false, message: "", data: null };
    const regex = new RegExp(input, "i");
    const pipeline = [
      { $match: { tags: regex } },
      { $unwind: "$tags" },
      { $match: { tags: regex } },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ];
    try {
      const result = await this.pictureDB.aggregate(pipeline).toArray();
      const matchedTags = result.map((entry) => entry._id);
      obj.message = "";
      obj.success = true;
      obj.data = matchedTags;
    } catch (error) {
      obj.message = `Error occurred while matching tags: ${error}`;
    }
    console.log(obj.message);
    return obj;
  }

  /**
   * find up to ten imgaes in the database that has the input tag
   * @param {String} tag 
   * @return {Promise<Object>} { success: boolean, message: string, data: Array<picture> }
   */
  async getPictureByTag(tag) {
    const obj = { success: false, message: "", data: null };
    const pipeline = [
      { $match: { tags: tag } },
      { $limit: 10 },
    ];
  
    try {
      const result = await this.pictureDB.aggregate(pipeline).toArray();
      obj.message = "";
      obj.success = true;
      obj.data = result;
    } catch (error) {
      obj.message = `Error occurred while matching tags: ${error}`;
    }
  
    console.log(obj.message);
    return obj;
  }  
  
  

  /***************************** r/w functions for Mapic (homepage) *****************************/

  /***************************** r/w functions for profile page *****************************/

/**
 * Get the most popular pic of a user
 * Return null if the user has no pictures
 * @param {String} userName
 * @return {Object} { success: boolean, message: string, data: Object }
 */
async getMostLikedPic(userName) {
  const obj = { success: false, message: "", data: null };

  try {
    const user = await this.userDB.findOne({ _id: md5(userName) });
    const picArray = user.pictures;
    if (!picArray || picArray.length === 0) {
      obj.message = `User ${userName} has no pictures.`;
      console.log(obj.message);
      return obj;
    }

    let mostLikedPic = null;
    let maxLikes = -1;

    for (const picId of picArray) {
      const pic = await this.pictureDB.findOne({ _id: picId });
      if (pic && pic.like > maxLikes) {
        mostLikedPic = pic;
        maxLikes = pic.like;
      }
    }

    if (mostLikedPic) {
      obj.success = true;
      obj.message = `Most liked picture of user ${userName} retrieved successfully.`;
      obj.data = mostLikedPic;
    } else {
      obj.message = `User ${userName} has no pictures with likes.`;
    }
  } catch (error) {
    obj.message = `Error occurred while retrieving most liked picture of user ${userName}: ${error}`;
  }

  console.log(obj.message);
  return obj;
}


/**
 * Update the settings field of a user
 * @param {String} userName
 * @param {Object} newSetting {Theme : string, Privatemode : boolean}
 * @return {Object} { success: boolean, message: string }
 */
async updateSetting(userName, newSetting) {
  const obj = { success: false, message: "" };
  try {
    const result = await this.userDB.updateOne(
      { userName: userName },
      { $set: { settings: newSetting } }
    );
    if (result.modifiedCount === 1) {
      obj.success = true;
      obj.message = `Settings updated for user ${userName}.`;
    } else {
      obj.message = `User ${userName} not found.`;
    }
  } catch (error) {
    obj.message = `Error occurred while updating settings for user ${userName}: ${error}`;
  }
  console.log(obj.message);
  return obj;
}

/**
 * Update the profile description of a user
 * @param {String} userName
 * @param {String} newDescription
 * @return {Object} { success: boolean, message: string }
 */
async updateDescription(userName, newDescription) {
  const obj = { success: false, message: "" };
  try {
    const result = await this.userDB.updateOne(
      { userName: userName },
      { $set: { profileDescription: newDescription } }
    );
    if (result.modifiedCount === 1) {
      obj.success = true;
      obj.message = `Profile description updated for user ${userName}.`;
    } else {
      obj.message = `User ${userName} not found.`;
    }
  } catch (error) {
    obj.message = `Error occurred while updating profile description for user ${userName}: ${error}`;
  }
  console.log(obj.message);
  return obj;
}

/**
 * Update the profile picture of a user
 * @param {String} userName
 * @param {byte64} newProfilePicture
 * @return {Object} { success: boolean, message: string }
 */
async updateProfilePicture(userName, newProfilePicture) {
  const obj = { success: false, message: "" };
  try {
    const result = await this.userDB.updateOne(
      { userName: userName },
      { $set: { profilePicture: newProfilePicture } }
    );
    if (result.modifiedCount === 1) {
      obj.success = true;
      obj.message = `Profile picture updated for user ${userName}.`;
    } else {
      obj.message = `User ${userName} not found.`;
    }
  } catch (error) {
    obj.message = `Error occurred while updating profile picture for user ${userName}: ${error}`;
  }
  console.log(obj.message);
  return obj;
}


}

const database = new Database();

export { database };
