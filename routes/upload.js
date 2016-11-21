var bodyParser = require('body-parser');
var express = require('express');
var fs = require('fs');
var router = express.Router();

router.post('/upload', bodyParser.text({
    limit: '3MB'
}), function ( req, res ) {

    var timestamp = Date.now();
    var base64Data = req.body.replace( /^data:image\/png;base64,/, '');

    fs.writeFile( __dirname +'/../database/'+ timestamp +'.png', base64Data, 'base64', function ( err ) {

        if ( err ) {
            res.end('ok');
        } else {
            res.end('notok');
        }
    });

} );

module.exports = router;