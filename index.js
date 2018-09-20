#! /usr/bin/env node

const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const gerarClasses = require("./gerarClasses.js")


readdir('./PostoFacil.Communication/Message/JSONMessages')
    .then(fileNames => fileNames.map(fileName => readFile(`./PostoFacil.Communication/Message/JSONMessages/${fileName}`, 'utf8')))
    .then(promiseArray => Promise.all(promiseArray))
    .then(stringArray => stringArray.map(JSON.parse))
    .then(retorno => retorno.map(gerarClasses))
    .then(filesArray => filesArray.map(file => writeFile(`./PostoFacil.Communication/Message/${file.fileName}.cs`, file.content)))
    .then(promiseArray => Promise.all(promiseArray))
    .then(() => console.log("Classes geradas com sucesso"))
    .catch(console.log);