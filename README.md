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
  Id: int UNIQUE
  userName: string UNIQUE
  password: string
  profileDescription: “I like to take pictures.” string
  profilePicture: byte64  
  settings: {
    Theme : string
    Privatemode : boolean
  } object
  pictures: [
    picId int
  ]
}
```
### Example json object for a picture:
```
{
  picId: string UNIQUE,
  ownerName: “”, string
  picBase64: byte64
  like: 0,
  tags: [“”,... string]
  description: “” string,
  createdTime: “yyyy:mm:dd hh:mm:ss” string
  exif: {
    time: yyyy:mm:dd hh:mm:ss,
    location: {latitude,longitude},
    aperture: f/4,
    shutterSpeed: 1/125,
    ISO: 100
  }
  comments: [
    {
      commentString: “”, string
      commentTime: "yyyy:mm:dd hh:mm:ss" string,
      commentBy: userName
    }
  ]
}
```