var express = require('express');
var router = express.Router();

router.use('/slides', express.static( __dirname +'/../database' ));

module.exports = router;