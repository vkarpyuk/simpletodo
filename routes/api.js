/**
 * Created by vkarpyuk on 26/11/16.
 */
var express = require('express');
var router = express.Router();

// var DB = "mongodb://pmmanager:pmmanager1187@ds111748.mlab.com:11748/projects";
var DB = "mongodb://todoUser:admin1234@localhost/todos";
// var DB = "mongodb://test:admin1234@localhost/todos";
var mongojs = require('mongojs');
var db = mongojs(DB,['todos','alumnos']);

//Conecion Mongo a la coleccion alumnos
// var DB_ALUMNOS = "mongodb://todoUser:admin1234@localhost/alumnos";
// var db_alu = mongojs(DB_ALUMNOS,['alumnos']);

var todoUrl = "/todo";
var todosUrl = "/todos";


//-------------------TODOS ----------------------------------------------------
//CREAR UN TODO
router.post(todoUrl, function (request, response) {
    console.log("POST REQUEST:");
    console.log(request.body);
    console.log("-----------------------------------------");
    db.todos.insert(request.body, function(error, doc){
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

//BUSCAR LOS Todos
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

router.get(todosUrl, function (request, response) {
    console.log("HOLA ESTOY EN EN SERVER");
    console.log(request.body);
});


//---------------------------------- ALUMNOS ------------------------------

router.post("/alumno", function (request,response) {
    console.log(request.body);
    var alumno = request.body;
    alumno["todos"] = [];
    db.alumnos.insert(alumno, function (error, doc) {
        console.log("RESPONSE:");
        console.log(doc);
        console.log("-----------------------------------------");
        if(error){
            console.log("ERROR: ------------------------------");
            console.log(error);
        } else {
            response.status(201);
            response.send(doc);
        }
    })
})

router.get("/alumno", function (request,response) {
    db.alumnos.find({}, function(error, alumnos){
        console.log("RESPONSE:");
        if(!error){
            console.log(alumnos);
            response.status(200);
            response.send(alumnos);

        }

        console.log("-----------------------------------------");
    })
})


router.post("/alumno/:id/todo", function(request, response){
    console.log("REQUEST PUT ALUMNO:");
    console.log(request.body);

    var todo = request.body.todo;

    //genero la clave
    todo["id"] = mongojs.ObjectID();

    console.log(todo);
    db.alumnos.update(
        {_id:mongojs.ObjectID(request.params.id)},
        {$push: {
            "todos":todo
        }},
        function(error,alumno){
            if(!error){
                console.log("ACA _____");
                db.alumnos.findOne({_id:mongojs.ObjectID(request.params.id)}, function (error, alumno) {
                    response.status(200);
                    response.send(alumno);
                });
                // console.log(alumno);
                // response.status(201);
                // response.send(alumno);
            } else {
                console.log("ERROR: ver el log de error");
                console.log(error);
            }
        }
    );

    // db.alumnos.findOne({_id:mongojs.ObjectID(request.params.id)}, function (error, alumno) {
    //     //new todo id generation
    //     var todoId = mongojs.ObjectID();
    //     if(!error){
    //         console.log("ALUMNO PARA UPDATE:");
    //
    //         console.log(alumno);
    //
    //         var todo = request.body.todo;
    //
    //         alumno.todos.push(todo);
    //
    //         console.log(alumno);
    //
    //         db.alumnos.save(alumno, function (error, alumno) {
    //             if(error){
    //                 console.log(error);
    //             } else {
    //                 response.status(200);
    //                 response.send(alumno);
    //             }
    //         });
    //
    //     } else {
    //         console.log(error)
    //     }
    // });
})

router.delete("/alumno/:id", function (request, response) {
    console.log("-----------------------------------------");
    console.log("DELETE REQUEST:");
    console.log(request.params.id);

    db.alumnos.remove({_id:mongojs.ObjectID(request.params.id)}, function(err){
        if(err){
            console.log("ERROR!");
        } else {
            console.log("DELETED");
            db.alumnos.findOne({_id:mongojs.ObjectID(request.params.id)}, function (error, alumno) {
                response.status(200);
                response.send(alumno);
            });
            // response.status(200);
            // response.send("OK");
        }
    });

    db.alumnos.findOne({_id:mongojs.ObjectID(request.params.id)}, function (error, alumno) {
        //callback
    });

    console.log("-----------------------------------------");
});


router.delete("/alumno/:idAlumno/todo/:idTodo", function (request, response) {
    console.log("-----------------------------------------");
    console.log("DELETE REQUEST:");

    console.log("idAlumno: "+request.params.idAlumno);
    console.log("idTodo: "+request.params.idTodo);

    db.alumnos.update(
        {_id:mongojs.ObjectID(request.params.idAlumno)},
        {$pull: {"todos":{id:mongojs.ObjectID(request.params.idTodo)}}},
        function (error,result) {
            if(!error){
                // response.status(200);
                // response.send(result);
                db.alumnos.findOne({_id:mongojs.ObjectID(request.params.idAlumno)}, function (error, alumno) {
                    if(!error){
                        console.log("alumno: ---------------------------------------->");
                        console.log(alumno);
                        response.status(200);
                        response.send(alumno);
                    }
                });
            }
        }
    );


    // db.alumnos.findOne({_id:mongojs.ObjectID(request.params.id)}, function (error, alumno) {
    //     var todoIndex = null;
    //
    //     for(var i = 0; i<alumno.todos.length; i++){
    //         if(alumno.todos[i].id===request.params.idTodo){
    //             todoIndex = i;
    //             break;
    //         }
    //     }
    //
    //     console.log(request.params.name);
    //     console.log(todoIndex);
    //     console.log(alumno);
    //     if (todoIndex > -1) {
    //         alumno.todos.slice(todoIndex, 1);
    //     }
    //     db.alumnos.save(alumno, function (error, alumno) {
    //         if(error){
    //             console.log(error);
    //         } else {
    //             response.status(200);
    //             response.send(alumno);
    //         }
    //     });
    //
    // });
    console.log("-----------------------------------------");
});
module.exports = router;