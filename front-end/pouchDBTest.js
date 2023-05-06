import { database } from "./pouchDB.js";
import { readFile, writeFile } from "fs/promises";

// const personData = readFile('./testUserData.json').then(data => JSON.parse(data));
// const ImgData = readFile('./testImgData.json').then(data => JSON.parse(data));

function test1() {
    database.createUser("testPerson1", "12345678");
    database.updateUser("testPerson1", "12345679", "I am a test!", "", {"Theme": "black", "Privatemode": false}, []);
    console.log(database.readUser("testPerson1"));
    database.deleteUser("testPerson1");
    console.log(database.readUser("testPerson1"));
}

function test2() {
    database.createUser("testPerson2", "23456789");
    console.log(database.readUser("testPerson2"));
    database.deleteUser("testPerson2");
    console.log(database.readUser("testPerson2"));
    console.log(database.readAllUsers());
}

test1();
test2();

