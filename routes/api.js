/**
 * Created by vkarpyuk on 26/11/16.
 */
var express = require('express');
var router = express.Router();

//MLAB remote mongodb: projects
var DB = "mongodb://pmmanager:pmmanager1187@ds111748.mlab.com:11748/projects";
var mongojs = require('mongojs');
var db = mongojs(DB,['todos','alumnos']);



//-------------------TODOS RESTFULL API---------------------------------------------


//CREATE A TODO
router.post("/todo", function (request, response) {
    console.log("POST REQUEST:");
    console.log(request.body);
    console.log("-----------------------------------------");
    db.todos.insert(JSON.stringify(request.body), function(error, doc){
        console.log("RESPONSE:");
        console.log(doc);
        console.log("-----------------------------------------");
        if(error){
            console.log("ERROR: "+error);
        } else {
            response.status(201);
            response.send("OK");
            // console.log(response);
            // response.send("OK");
        }

        // send(JSON.stringify(doc));
    })


});

//MODIFY THE TODO BY ITS ID
router.put("/todo/:id", function (request,response) {
    console.log("PUT REQUEST");
    console.log("ID: "+request.params.id);
    console.log("request.body: ");
    console.log(request.body);

    db.todos.save({_id:mongojs.ObjectID(request.params.id), name:request.body.name, complete:request.body.complete},{w:1},
        function (error, doc) {
            if(error){
                console.log("ERROR al guardar/crear el todo");
                response.status(501);
            } else {
                response.status(200);
                response.send("OK");
            }
    });

});

//DELETE THE TODO BY ITS ID
router.delete("/todo/:id", function (request, response, next){
    console.log("-----------------------------------------");
    console.log("DELETE REQUEST:");
    console.log(request.params.id);
    var idToRemove = request.params.id;
    db.todos.remove({_id:mongojs.ObjectID(idToRemove)}, function(err){
        if(err){
            console.log("ERROR!");
        } else {
            console.log("DELETED");
        }
    });
    response.status(200);
    response.send("OK");
    console.log("-----------------------------------------");
})

//GET ALL TODOS
router.get("/todo", function (request, response) {
    console.log("-----------------------------------------");
    console.log("GET REQUEST:");
    console.log(request.body);
    console.log("-----------------------------------------");
    db.todos.find({}, function(error, doc){
        console.log("RESPONSE:");
        console.log(doc);
        console.log("-----------------------------------------");
        response.send(doc);
    })
});

module.exports = router;