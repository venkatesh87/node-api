var models = require('../../models');
var express = require('express');
var router = express.Router();
var multer = require('multer');
var mime = require('mime');
var feedback = require('../../controllers/doctor_feedbacks');
var upload = multer();
var fs = require('fs');
var async = require('async');
var oauth = require('../../config/oauth');
var auth = require('../../config/auth');
var path = require('path');
language = require('../../controllers/language');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var destFolder = 'public/uploads/';
        if (!fs.existsSync(destFolder+file.fieldname)) {
            fs.mkdirSync(destFolder+file.fieldname);
        }
        cb(null, destFolder);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname+'/'+Date.now() + '.' + mime.extension(file.mimetype));
    }
});
var uploadFile = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
           cb(language.lang({key:"Only image files are allowed!",lang:req.body.lang}), false);
        } else {
            cb(null, true);
        }
    },
    limits: {fileSize: 1000000}
}).any();

/* GET list of doctor's feedback */
router.post('/', oauth.oauth.authorise(), upload.array(), function (req, res) {
    feedback.getDoctorFeedback(req, function (result) {
        res.send(result);
    });
});

/**
 * @api {post} /doctor/feedback/get-list Get feedback list
 * @apiName feedback list api for doctor app
 * @apiGroup Doctor
 *
 * @apiParam {integer} doctorProfileId required doctorProfileId
 * @apiParam {integer} langId required
 * @apiParam {String} lang required
 * @apiParam {String} type required for doctor app(value - 'all')
 * @apiParam {integer} pageNo page number for pagination (optional)
 * @apiParam {integer} limit data limit (optional)
 *
 */
router.post('/get-list', oauth.oauth.authorise(), upload.array(), function (req, res) {
    feedback.getDoctorFeedbackForApp(req, function (result) {
        res.send(result);
    });
});

/* GET list of feedback for 3rd role */
router.post('/dohfeedback', oauth.oauth.authorise(), upload.array(), function (req, res) {
    feedback.getDohFeedback(req, function (result) {
        res.send(result);
    });
});

router.use(oauth.oauth.errorHandler());
module.exports = router;