import PouchDB from "pouchdb";
import * as http from "http";
import * as url from "url";

let counters = {};

const headerFields = { "Content-Type": "text/html" };

const db = new PouchDB("counter");

let res = await db.allDocs({
  include_docs: true,
  attachments: true,
});

async function reload() {
  counters = res !== null ? res : {};
}

function counterExists(name) {
  return name in counters;
}

async function createCounter(response, name) {
  if (name === undefined) {
    // 400 - Bad Request
    response.writeHead(400, headerFields);
    response.write("<h1>Counter Name Required</h1>");
    response.end();
  } else {
    reload();
    counters[name] = 0;
    console.log("creating...");
    console.log(counters);
    await db.post(counters);
    response.writeHead(200, headerFields);
    response.write(`<h1>Counter ${name} Created</h1>`);
    response.end();
  }
}

function readCounter(response, name) {
  if (counterExists(name)) {
    reload();
    console.log(counters);
    response.writeHead(200, headerFields);
    response.write(`<h1>Counter ${name} = ${counters[name]}</h1>`);
    response.end();
  } else {
    // 404 - Not Found
    response.writeHead(404, headerFields);
    response.write(`<h1>Counter ${name} Not Found</h1>`);
    response.end();
  }
}

async function updateCounter(response, name) {
  if (counterExists(name)) {
    response.writeHead(200, headerFields);
    reload();
    counters[name] += 1;
    await db.post(counters);
    onsole.log(counters);
    response.write(`<h1>Counter ${name} Updated</h1>`);
    response.end();
  } else {
    // 404 - Not Found
    response.writeHead(404, headerFields);
    response.write(`<h1>Counter ${name} Not Found</h1>`);
    response.end();
  }
}

async function deleteCounter(response, name) {
  if (counterExists(name)) {
    response.writeHead(200, headerFields);
    reload();
    delete counters[name];
    await db.post(counters);
    console.log(counters);
    response.write(`<h1>Counter ${name} Deleted</h1>`);
    response.end();
  } else {
    // 404 - Not Found
    response.writeHead(404, headerFields);
    response.write(`<h1>Counter ${name} Not Found</h1>`);
    response.end();
  }
}

function dumpCounters(response) {
  response.writeHead(200, headerFields);
  response.write("<h1>Counters</h1>");
  response.write("<ul>");
  for (const [key, value] of Object.entries(counters)) {
    response.write(`<li>${key} = ${value}</li>`);
  }
  response.write("</ul>");
  response.end();
}

async function basicServer(request, response) {
  const options = url.parse(request.url, true).query;

  if (request.url.startsWith("/counters/create")) {
    createCounter(response, options.name);
  } else if (request.url.startsWith("/counters/read")) {
    readCounter(response, options.name);
  } else if (request.url.startsWith("/counters/update")) {
    updateCounter(response, options.name);
  } else if (request.url.startsWith("/counters/delete")) {
    deleteCounter(response, options.name);
  } else {
    dumpCounters(response);
  }
}

// Start the server on port 8080.
http.createServer(basicServer).listen(3000, () => {
  console.log("Server started on port 3000");
});
