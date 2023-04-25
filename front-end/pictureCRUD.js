import PouchDB from "pouchdb";
import * as http from "http";
import * as url from "url";
import md5 from "md5";

import users from userProfile;

let pictures ={}

const headerFields = { "Content-Type": "text/html" };

const db = new PouchDB("pictures");

db.allDocs({
  include_docs: true,
  attachments: true,
}).then(function (res) {
  res.rows.forEach(function (row) {
    users[row.doc._id] = row.doc;
  });
});

let res = await db.allDocs({
  include_docs: true,
  attachments: true,
});

const pictureProfile={
    like: 0,
    tags: [""],
    description: "",
    location: {latitude:0,longitude:0},
    exif: {
        time: "",
        location: [0,0],
        aperture: 0,
        shutterSpeed: 0,
        ISO:0
    },
    comment: [
        {
            commentString: "",
            commentTime:"",
            commentBy: ""
        }
    ]
    
}

async function reload() {
  pictures = res !== null ? res : {};
}

function userExists(user) {
  return md5(user) in users;
}

function pictureExists(user, pic) {
    return md5(pic) in pictures[md5(user)];
  }

async function createPicture(response, user, pic) {
  if (((user === undefined || !userExists(md5(user)))) && (pic!== undefined && !pictureExists(user,pic))){
    // 400 - Bad Request
    response.writeHead(400, headerFields);
    response.write("<h1>User Name Required</h1>");
    response.end();
  } else {
    reload();
    const user_id = md5(user);
    const pic_id = md5(pic);
    let new_picture = pictureProfile;
    
    //need to work with Google Map API
    //new_picture[location]={}
    pictureProfile[user_id][pic_id] =pictureProfile;
    
    await db.post(users);
    response.writeHead(200, headerFields);
    response.write(`<h1>User ${user}'s pic Created</h1><br \><img src=${pic}>`);
    response.end();
  }
}

async function readPicture(response, user, pic) {
  if (userExists(user) && pictureExists(pic)) {
    reload();
    console.log(users);
    response.writeHead(200, headerFields);
    response.write(`<h1>User ${name} and ${users[md5(name)]}</h1>`);
    response.end();
  } else {
    // 404 - Not Found
    response.writeHead(404, headerFields);
    response.write(`<h1>User ${name} Not Found</h1>`);
    response.end();
  }
}

async function updateUser(response, old_name, new_name, new_password,new_profileDescription) {
  if (userExists(old_name)) {
    response.writeHead(200, headerFields);
    reload();
    let id = md5(old_name).toLocaleString();
    delete users[id];
    id = md5(new_name).toLocaleString();
    let update_profile =userProfile;
    update_profile["_id"]=id;
    update_profile["userName"]=new_name;
    update_profile["password"]=new_password;
    update_profile["profileDescription"]=new_profileDescription;
    users[id]=update_profile;
    //need to do separate fucntion for setting
    await db.post(users);
    console.log(users);
    response.write(`<h1>User ${old_name} Updated</h1>`);
    response.end();
  } else {
    // 404 - Not Found
    response.writeHead(404, headerFields);
    response.write(`<h1>User ${old_name} and \n ${md5(old_name)} Not Found</h1>`);
    response.end();
  }
}

async function deleteUser(response, name) {
  if (userExists(name)) {
    response.writeHead(200, headerFields);
    reload();
    delete users[md5(name)];
    await db.post(users);
    console.log(users);
    response.write(`<h1>User ${name} Deleted</h1>`);
    response.end();
  } else {
    // 404 - Not Found
    response.writeHead(404, headerFields);
    response.write(`<h1>User ${name} Not Found</h1>`);
    response.end();
  }
}

function dumpUsers(response) {
  response.writeHead(200, headerFields);
  response.write("<h1>Users</h1>");
  response.write("<ul>");
  for (const [key, value] of Object.entries(users)) {
    response.write(`<li>${key} = ${value}</li>`);
  }
  response.write("</ul>");
  response.end();
}

async function basicServer(request, response) {
  const options = url.parse(request.url, true).query;

  if (request.url.startsWith("/users/create")) {
    createUser(response, options.name, options.password);
  } else if (request.url.startsWith("/users/read")) {
    readUser(response, options.name);
  } else if (request.url.startsWith("/users/update")) {
    updateUser(response, options.old_name, options.new_name,
       options.new_password, options.new_profileDescription);
  } else if (request.url.startsWith("/users/delete")) {
    deleteUser(response, options.name);
  } else {
    dumpUsers(response);
  }
}

// Start the server on port 8080.
http.createServer(basicServer).listen(3000, () => {
  console.log("Server started on port 3000");
});

/**
 * http://localhost:3000/users/create?name=JohnDoe&password=123
 * http://localhost:3000/users/update?old_name=JohnDoe&new_name=JaneDoe&password=123
 * http://localhost:3000/users/read?name=JaneDoe
 */

