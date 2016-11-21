var express = require('express');
var fs = require('fs');
var router = express.Router();

function fileListingAsJson ( files ) {
    return files
        .filter( function ( name ) {

            return /(png|jpg)$/.test( name );
        })
        .map( function ( name ) {
            return 'slides/'+ name;
        })
        .reverse()
    ;
}

router.get( '/list', function ( req, res ) {

    fs.readdir( __dirname +'/../database', function ( err, files ) {
        if ( err ) {
            res.status( 500 );
            res.send({
                code: 500,
                error: 'Error reading file system'
            });
        } else {
            res.type('json');
            res.send( fileListingAsJson( files ) );
        }
    } )
});

module.exports = router;