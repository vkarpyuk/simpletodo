/**
 * Created by vkarpyuk
 */

//---------------------------------------------------------------------------------------------------------------
//------------------------------------------- GENERIC AJAX CALL -------------------------------------------------
ajaxCall = function(type,url,data,onSuccess){
    var ajaxCallConf = {
        type: type,
        url: url,
        contentType:"application/json; charset=utf-8",
        async: true,
        success: onSuccess
    };
    if(type==="PUT" || type === "POST"){
        ajaxCallConf["data"] = JSON.stringify(data);
    };
    $.ajax(ajaxCallConf);
};

//---------------------------------------------------------------------------------------------------------------
//------------------------------------------- AJAX CUSTOM FUNCTION-----------------------------------------------

//CUSTOM AJAX CALLS
//1. GetTodo, 2.PutTodo, 3.DeleteTodo, 4.PostTodo

//1. GET
GetTodo = function (todo,onSuccess) {
    if(jQuery.isEmptyObject(todo)){
        ajaxCall("GET", "/api/todo", null, onSuccess);
    } else {
        ajaxCall("GET", "/api/todo/"+todo._id, null, onSuccess);
    }
};

//2. PUT
PutTodo = function(todo, onSuccess){
    ajaxCall("PUT", "/api/todo/"+todo._id, todo, onSuccess);
}

//3. DELETE
DeleteTodo = function(id, onSuccess){
    ajaxCall("DELETE", "/api/todo/"+id, null, onSuccess);
};

//4. POST
PostTodo = function(todo, onSuccess){
    ajaxCall("POST","/api/todo", todo, onSuccess);
};
//--------------------------------------------------------------------------------------------------------------------
//-----------------------------------------END AJAX' CUSTOM FUNCTIONS ------------------------------------------------------------------


//--------------------------------------------------------------------------------------------------------------------
//-----------------------------------------CUSTOM FUNCTIONS-----------------------------------------------------------

getAllTodoSucess = function (response) {
    $("#todos-all-id").empty();
    response.forEach(function (todo, index) {
        $("#todos-all-id").append(createRow(todo));
        if(todo.complete){
            $("#complete-"+todo._id).prop("checked", true);
            $("#li-"+todo._id).removeClass("list-group-item-info");
            $("#li-"+todo._id).addClass("list-group-item-success");
            $("#name-"+todo._id).addClass("tachado");
        } else {
            $("#complete-"+todo._id).prop("checked", false);
            $("#li-"+todo._id).removeClass("list-group-item-success tachado");
            $("#li-"+todo._id).addClass("list-group-item-info");
            $("#name-"+todo._id).removeClass("tachado");
        }

        $("#complete-"+todo._id).change(function () {
            if($(this).prop("checked")){
                $("#li-"+todo._id).removeClass("list-group-item-info");
                $("#li-"+todo._id).addClass("list-group-item-success");
                $("#name-"+todo._id).addClass("tachado");
                todo.complete = true;
                PutTodo(todo,function(){console.log("chekced")});
            }  else {
                todo.complete = false;
                PutTodo(todo,function(){console.log("unchecked")});
                $("#li-"+todo._id).removeClass("list-group-item-success");
                $("#li-"+todo._id).addClass("list-group-item-info");
                $("#name-"+todo._id).removeClass("tachado");
            }

        })
    })
};


getAllTodos = function() {
    GetTodo({}, getAllTodoSucess);
};

modifyTodo = function(todo){

    //WE SPLIT THE ID TO GET THE TODO'S ID
    var id = todo.attr("id").split("-")[1];

    var todo = $("#li-"+id).data("data-todo");

    // $("#input-todo-id").attr("data-todo", todo.attr("data-todo"));
    $("#input-todo-id").attr("data-todo-id",todo._id);

    console.log(todo);

    $("#input-todo-id").val(todo.name);
    $("#btn-post-id").addClass("hidden");
    $("#btn-put-id").removeClass("hidden");
    $("#btn-cancel-id").removeClass("hidden");
}

deleteTodo = function(todo){
    var isConfirmed = confirm("ARE YOU SURE?");
    if(isConfirmed){
        var id = todo.attr("id").split("-")[1];
        DeleteTodo(id, function (response) {
            console.log("DELETE SUCCESS");
            console.log(response);
            getAllTodos();
        });
    }
};

// CREATE EACH TODO ROW WITH JQUERY
createRow = function(todo){
    var actions =
        $('<li id='+"li-"+todo._id+' class="list-group-item list-group-item-info">'+
            '<div class="row">'+
                '<div class="col-sm-4">'+
                    '<span id='+"name-"+todo._id+'>'+"\""+todo.name+"\""+'</span>'+
                    '</div>'+
                '<div class="col-sm-2">'+
                    '<div class="btn-group" role="group">'+
                        '<button id='+"delete-"+todo._id+' type="button" class="btn btn-danger" onclick="deleteTodo($(this))"><span class="glyphicon glyphicon-remove"></span></button>'+
                    '</div>'+
                '</div>'+
                '<div class="col-sm-2">'+
                    '<div class="btn-group" role="group">'+
                        '<button id='+"modify-"+todo._id+' style="text-align:center" type="button" class="btn btn-warning" onclick="modifyTodo($(this))"><span class="glyphicon glyphicon-pencil"></span></button>' +
                    '</div>'+
                '</div>'+
                '<div class="col-sm-2">'+
                    '<div class="btn-group" role="group">'+
                        '<div class="input-group">'+
                            '<span class="input-group input-sm">'+
                                '<input id='+"complete-"+todo._id+' type="checkbox" aria-label="...">'+
                            '</span>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</li>');

    //HERE WE STORE THE TODO IN THE li ELEMENT IN ORDER TO RETRIEVE IT LATER
    actions.data("data-todo", todo);
    return actions;
}


//---------------------------------------------------------------------------------------------------------------
//------------------------------------------- OTHER FUNCTION-----------------------------------------------
postOnSuccess = function (response) {
    console.log("POST SUCCESS");
    getAllTodos();
    $("#input-todo-id").val("");
}

//
afterUpdateOrCancel = function () {
    $("#btn-post-id").removeClass("hidden");
    $("#btn-put-id").addClass("hidden");
    $("#btn-cancel-id").addClass("hidden");
    $("#input-todo-id").val("");
}


//---------------------------------------------------------------------------------------------------------------
//------------------------------------------- READY -------------------------------------------------------------

$(document).ready(function(){

    //GET ALL TODOS OR TASKS
    getAllTodos();

    //REGISTER ONCLICK OF "ADD TODO"
    $("#btn-post-id").on("click", function(){
        var todo = {};
        var todoValue = $("#input-todo-id").val();
        todo["name"] = todoValue;
        todo["complete"] = false;
        // POST AJAX CALL
        PostTodo(todo, postOnSuccess);

    });

    //REGISTER ONLICK OF 'CANCEL'
    $("#btn-cancel-id").on("click", function (e) {
        afterUpdateOrCancel();
    });

    //REGISTER ONCLICK OF "OK"
    $("#btn-put-id").on("click", function(){
        var isConfirmed = confirm("ARE YOU SURE?");
        if(isConfirmed){
            var updatedValue = $("#input-todo-id").val();
            var todoId = $("#input-todo-id").attr("data-todo-id");
            var todo = $("#li-"+todoId).data("data-todo");
            todo.name = updatedValue;
            console.log(todo);
            PutTodo(todo, function(){
                console.log("PUT SUCCESS");
                getAllTodos();
                afterUpdateOrCancel();
            });
        } else {
            afterUpdateOrCancel()
        }
    });

});