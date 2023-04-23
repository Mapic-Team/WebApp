import PouchDB from "pouchdb";
import * as http from "http";
import * as url from "url";
import { md5 } from "blueimp-md5";

let users = {};


const headerFields = { "Content-Type": "text/html" };

const db = new PouchDB("users");

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

async function reload() {
  users = res !== null ? res : {};
}

function userExists(name) {
  return name in users;
}

async function createUser(response, name) {
  if (name === undefined) {
    // 400 - Bad Request
    response.writeHead(400, headerFields);
    response.write("<h1>User Name Required</h1>");
    response.end();
  } else {
    reload();
    users[name] = 0;
    console.log("creating...");
    console.log(users);
    await db.post(users);
    response.writeHead(200, headerFields);
    response.write(`<h1>User ${name} Created</h1>`);
    response.end();
  }
}

async function readUser(response, name) {
  if (userExists(name)) {
    reload();
    console.log(users);
    response.writeHead(200, headerFields);
    response.write(`<h1>User ${name} = ${users[name]}</h1>`);
    response.end();
  } else {
    // 404 - Not Found
    response.writeHead(404, headerFields);
    response.write(`<h1>User ${name} Not Found</h1>`);
    response.end();
  }
}

async function updateUser(response, name) {
  if (userExists(name)) {
    response.writeHead(200, headerFields);
    reload();
    users[name] += 1;
    await db.post(users);
    console.log(users);
    response.write(`<h1>User ${name} Updated</h1>`);
    response.end();
  } else {
    // 404 - Not Found
    response.writeHead(404, headerFields);
    response.write(`<h1>User ${name} Not Found</h1>`);
    response.end();
  }
}

async function deleteUser(response, name) {
  if (userExists(name)) {
    response.writeHead(200, headerFields);
    reload();
    delete users[name];
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

function dumpCounters(response) {
  response.writeHead(200, headerFields);
  response.write("<h1>Counters</h1>");
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
    createUser(response, options.name);
  } else if (request.url.startsWith("/users/read")) {
    readUser(response, options.name);
  } else if (request.url.startsWith("/users/update")) {
    updateUser(response, options.name);
  } else if (request.url.startsWith("/users/delete")) {
    deleteUser(response, options.name);
  } else {
    dumpCounters(response);
  }
}

// Start the server on port 8080.
http.createServer(basicServer).listen(3000, () => {
  console.log("Server started on port 3000");
});
