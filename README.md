# simpletodo
A simple todo app build with nodejs, express, mongodb, mongojs, javascript, jquery and html5

# Steps to get ready:

## Prerequisites

* [Node.js](https://nodejs.org) - Download and Install Node.js
* [MongoDb](https://www.mongodb.com/) - Download and Install mongodb

## Step to configure
1. Clone or fork this project
2. cd to the cloned project folder
3. sudo npm init
4. npm i --save

If you want dynamically rebuild the server you should install nodemon (-g stands for global). It will observes any changes and rebuild the server automatically.
* sudo npm i nodemon -g

## Run 
To run the example go to the cloned project folder and type:

### * Run with node
node server.js   

### * Run with nodemon
nodemon server.js

### * Run with [pm2](https://www.npmjs.com/package/pm2)
pm2 start server.js --name theNameYouWant

