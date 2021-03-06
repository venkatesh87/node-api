var manager = require('../controllers/manager');
var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer();
var fs = require('fs');
var oauth = require('../config/oauth');

/* GET language */
router.post('/list', oauth.oauth.authorise(), upload.array(), function (req, res) {
    manager.list(req, function(result){
        res.send(result);
    });
});

module.exports = router;
