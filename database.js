import { MongoClient } from 'mongodb';
import testUserData from './front-end/testUserData.json' assert { type: 'json' };

const connectionString = 'mongodb+srv://Barricature:wTz63sS8Nv7uECS0@cluster0.pmk22hf.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(connectionString);
await client.connect();

class Database {
    constructor() {
        const database = client.db('Mapic_database');
        this.userDB = database.collection('userDB');
        this.pictureDB = database.collection('pictureDB');
    }
    /***************************** utility functions *************************/
  
  
    /**
     * Helper function
     * Given a picId and the user that created it,
     * append the picId to the end of the pictures array of that specific user
     * in the user database
     * @param {String} picId 
     * @param {String} userName 
     * @return {void}
     */
    async #addPic(picId, userName) {
      const picArray = await this.userDB.findOne({_id: md5(userName)}).pictures;
      picArray.push(picId);
      const result = await this.userDB.updateOne({_id: md5(userName)},
      {
        $set: {
          pictures: picArray
        }
      });
    }

    async #removePic(picId, userName) {
      const picArray = await this.userDB.findOne({_id: md5(userName)}).pictures;
      picArray.remove(picId);
      const result = await this.userDB.updateOne({_id: md5(userName)},
      {
        $set: {
          pictures: picArray
        }
      });
    }

    /**
     * Helper function
     * Generates a random ID
     * @return {Int} with length of 16-17
     */
    #randId() {
        return Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9*Math.pow(10, 12)).toString(36);
    }
  
    /***************************** userDB CRUD functions *************************/
  
    /**
     * Creates a user with userName and password
     * @param {String} userName 
     * @param {String} password
     * @returns {void}
     */
    async createUser(userName, password) {
        const user = {
            _id: md5(userName),
            userName: userName,
            password: password
        };
        const result = await this.userDB.insertOne(user);
        console.log(`Added user ${user}`)
    }
  
    /**
     * Read all user information given a userName
     * @param {String} userName 
     * @returns {Object}
     */
    async readUser(userName) {
        const result = await this.userDB.findOne({_id: md5(userName)});
        return result;
    }
  
    /**
     * Remove a user from the database and remove all pertaining information
     * @param {*} userName 
     * @returns {void}
     */
    async deleteUser(userName) {
        const result = await this.userDB.deleteOne({_id: md5(userName)});
        console.log(`Deleted user ${userName}`);
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
    async createPicture(
      ownerName,
      imgBase,
      tags,
      description,
      EXIF
    ) {
      // very unique generation, length 16-17
      const Id = randId();
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
      // add the picture under the user
      await addPic(Id, userName);
      const result = await this.pictureDB.insertOne(pic);
      console.log(`Added picture ${Id}`);
    }
  
    /**
     * Get all information pertaining to the picture
     * @param {String} picId 
     * @returns {Object}
     */
    async readPicture(picId) {
      const result = await this.userDB.findOne({_id: md5(userName)});
      return result;
    }
  
    /**
     * Delete a picture from the pictureDB,
     * also delete it from its owner's pictures array
     * @param {String} picId 
     * @returns {void}
     */
    async deletePicture(picId) {
      const userName = await this.pictureDB.findOne({_id: md5(picId)}).ownerName;
      await removePic(picId, userName);
      const result = await this.pictureDB.deleteOne({_id: md5(picId)});
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
      const result = await this.pictureDB.updateOne({_id: md5(picId)}, 
      {
        $inc: {
          like: change
        }
      });
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
      const commentArray = await this.pictureDB.findOne({_id: md5(picId)}).comments;
      commentArray.push(comment_profile);
      const result = await this.pictureDB.updateOne({_id: md5(picId)},
      {
        $set: {
          comments: commentArray
        }
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
              $lte: currentDate
            }
          }
        },
        { $sort: { like: -1 } },
        { $limit: 3 },
        {
          $project: {
            picBase64: 1,
          }
        }
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
            }
          }
        ];
  
        const additionalResult = await collection.aggregate(additionalPipeline).toArray();
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
        { $unwind: '$tags' },
        {
          $group: {
            _id: '$tags',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
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
    async getMostLikePic(userName) {
      const picArray = await this.userDB.findOne({_id: md5(userName)}).pictures;
      const mostLikedPic = null;
      pictures.reduce(async (acc, e) => {
        const pic = await this.pictureDB.findOne({_id: md5(e)});
        if(pic.like > acc) {
          mostLikedPic = pic;
          return pic.like;
        }
        return acc;
      }, 0)
    }
  
  }
  
  const database = new Database();
  
  export { database };
  
  