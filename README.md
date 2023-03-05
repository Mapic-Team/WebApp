# Team 1 Project

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

- Users can create an account to store their picture information
- Allows users to upload pictures
- Filters pictures by location
- Allows users to add tags to their pictures, which are later used to filter the pictures
- Allows users to comment and like the pictures


[MIT License](https://opensource.org/licenses/MIT)
