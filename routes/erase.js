var express = require('express');
var fs = require('fs');
var router = express.Router();


router.get( '/erase/:image', function ( req, res ) {

    var filePath;

    if ( req.params.image && /^[\w\.]+$/.test( req.params.image ) ) {

        filePath = __dirname +'/../database/'+ req.params.image;

        fs.stat( filePath, function ( err, stats ) {

            if ( err || ! stats.isFile() ) {
                res.status( 500 );
                res.end('notok');
            } else {
                fs.unlinkSync( filePath );
                res.end('ok');
            }
        } );

    } else {
        res.status( 401 );
        res.end('notok');
    }
});

module.exports = router;