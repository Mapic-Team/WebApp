# Team 1 Project

## Team Overview
Iris Xia [@Barricature](https://github.com/Barricature)\
Qiao Li [@QiaoLi0622](https://github.com/QiaoLi0622)\
Elvira Rui Xiong [@rxion19](https://github.com/rxion19)\
Max Tian [@mstian2024](https://github.com/mstian2024)

## Innovative Idea

Our Application is inspired by the Apple Map function that allows users to see pictures by their location. The core functionality of our app, however, lies in that people can socialize on this web app through browsing and interacting with each other’s photos. In addition to allowing people to see and comment on pictures, we also provide auxiliary filters to help people find pictures under the tags they’re interested in.

## Data

Picture => .png/.jpg/.jpeg/.pdf , we will give a unique label to this picture/picture sets
Picture info (Object, the key is the unique picture label):
  - Comments => Object entry, the comments will be an array of strings+username
  - Likes => Object entry, the likes number will be number+"@"+unique picture label
  - Author => Object entry, the username string
  - Description => Object entry, string 


## Functionality

- Users can create an account to store their picture information
- Allows users to upload pictures
- Filters pictures by location
- Allows users to add tags to their pictures, which are later used to filter the pictures
- Allows users to comment and like the pictures


[MIT License](https://opensource.org/licenses/MIT)
