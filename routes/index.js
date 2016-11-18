var express = require('express');
var router = express.Router();

router.use('/', express.static( __dirname +'/../app' ));

module.exports = router;