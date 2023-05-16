https://umass-cs-326.github.io/docs/project/ui-design/
# Team 1 Project

## Application Name
### Mapic

## Team Overview
Iris Xia [@Barricature](https://github.com/Barricature)\
Qiao Li [@QiaoLi0622](https://github.com/QiaoLi0622)\
Elvira Rui Xiong [@rxiong19](https://github.com/rxiong19)\
Max Tian [@mstian2024](https://github.com/mstian2024)

## Innovative Idea

Our website is inspired by the Apple Map's function allowing users to see pictures by location. It is a photo-sharing platform that allows users to upload and geotag their travel photos on a map. Users can upload their photos and tag them with a location, which is displayed on an interactive map that other users can explore. The platform also includes social features such as commenting, liking, and following other users. The website allows users to socialize with each other, share their travel experiences, and build their own photo portfolios. 
Existing social media platforms like Facebook and Instagram allow users to share their travel photos and experiences, but they lack the ability to organize and present those photos in a map-based format. In this case, our website’s map-centric approach provides a unique way for users to explore and discover new locations through the lens of others. Overall, it offers a unique and immersive way for users to explore the world around them through photos and stories and to connect with other users who share their interests and experiences.

## Data

Picture => .png/.jpg/.jpeg/.pdf , we will give a unique label to this picture/picture sets
Picture info (Object, the key is the unique picture label):
  - Comments => Object entry, the comments will be an array of strings+username
  - Likes => Object entry, the likes number will be number+"@"+unique picture label
  - Author => Object entry, the username string
  - Description => Object entry, string 


## Functionality

- User registration and authentication: Users can create an account and log in to the website to upload and view photos.
- User profiles: Each user has a profile page that displays their uploaded photos and other information.
- Photo Portfolio: Users can use the website to build their own photo portfolios and share them with others.
- Photo uploading and geotagging: Users can upload photos to the website and geotag them on a map, allowing them to be discovered and browsed by other users.
- Discovering stories: Users can explore other users' photos and stories based on location, category, date, or popularity.
- Social features: Users can interact with each other's photos by commenting and liking them.


[MIT License](https://opensource.org/licenses/MIT)

## Implementation Details

We have two databases, one stores the images and all pertaining information, the other stores all user information. The two databases are connected in the following way: users have a field that stores an array of picture IDs, which can be used to look up pictures in the picture database. All pictures are stored in byte64 formate.

### Example json object for a person:
```
{ 
  "_id": "d25c7286a46dbb6eeecc5cfddacd5818",
  "userName": "Iris",
  "password": "Iris01",
  "profileDescription": “I like to take pictures.”,
  "profilePicture": "",  
  "settings": {
    "Theme" : "black"
    "Privatemode" : false
  },
  "pictures": [
    "lhqhn62j2we4vu0wb",
    "lhqj47oz2ywxe59g4"
  ]
}
```
### Example json object for a picture:
```
{
  "_id": "lhqfx1ugmt620dvh",
  "ownerName": "Iris",
  "picBase64": ""
  "like": 0,
  "tags": [“National Park”, "Beautiful Day"]
  "description": "A very beautiful picture",
  "createdTime": 2023-05-16T13:18:10.922+00:00
  "exif": {
    "time": 2021:04:11 13:24:05,
    "location": {
      "lat": "42.403741",
      "lng": "-72.509133"
    }
    "aperture": "f/3.5",
    "exposure_time": "1/1000",
    "ISO": 100
  }
  comments: [
    {
      "commentString": "This is a good picture",
      "commentTime": "2023-05-16T16:40:03.400Z",
      "commentBy": "Elvira"
    }
  ]
}
```

# API Documentation

## Base URL

http://localhost:3000


## User Endpoints

### Create User

- URL: `/createUser`
- Method: `POST`
- Request Body:
  - `userName` (string): User name
  - `password` (string): User password

### Read User

- URL: `/readUser`
- Method: `GET`
- Query Parameter:
  - `userName` (string): User name

### Delete User

- URL: `/deleteUser`
- Method: `DELETE`
- Query Parameter:
  - `userName` (string): User name

## Picture Endpoints

### Create Picture

- URL: `/createPicture`
- Method: `POST`
- Request Body:
  - `ownerName` (string): Owner's user name
  - `imgBase` (string): Image base64 data
  - `tags` (array): Array of tags
  - `description` (string): Picture description
  - `exif` (object): EXIF data

### Read Picture

- URL: `/readPicture`
- Method: `GET`
- Query Parameter:
  - `picId` (string): Picture ID

### Delete Picture

- URL: `/deletePicture`
- Method: `DELETE`
- Query Parameter:
  - `picId` (string): Picture ID

## Update Endpoints

### Change Like By

- URL: `/changeLikeBy`
- Method: `POST`
- Request Body:
  - `picId` (string): Picture ID
  - `change` (number): Like count change (positive or negative)

### Add Comment

- URL: `/addComment`
- Method: `POST`
- Request Body:
  - `picId` (string): Picture ID
  - `comment` (string): Comment text
  - `userName` (string): User name

