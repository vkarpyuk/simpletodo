/**
 * Created by vkarpyuk on 26/11/16.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(request, response) {
    response.render('index.html');
});



module.exports = router;