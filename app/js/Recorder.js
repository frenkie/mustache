import BigButton from './BigButton.js';
import dat from 'dat.gui/build/dat.gui.min.js';
import recorderTemplate from '../templates/recorder.vue!text';
import tracking from 'tracking/build/tracking-min.js';
import faceTracking from 'tracking/build/data/face-min.js';
import Vue from 'vue';

var faceAccessories = [ 'mustache.png', 'anonymous.png', 'mario.png', 'dali.png', 'eagles.png', '70s.png' ];
var faceAccessoriesLoaded;
var faceAccessoriesRandomisedIndex = [];

var imageFrames = [ 'frame1.png', 'frame2.png', 'frame3.png', 'frame4.png', 'frame5.png' ];
var imageFramesLoaded;
var imageFramesRandomisedIndex = [];


function captureHighQualityVideoFrame () {

    return new Promise( function ( resolve, reject ) {

        var video = document.createElement( 'video' );
        video.width = 1024;
        video.height = 768;

        // Prefer camera resolution nearest to 1024x768.
        var constraints = { audio: false, video: { width: 1024, height: 768 } };

        navigator.mediaDevices.getUserMedia( constraints )
            .then( function ( mediaStream ) {

                video.srcObject = mediaStream;
                video.onloadedmetadata = function ( e ) {

                    video.play();
                    resolve( video ); // should have enough time to process
                    video.pause();
                    video = null;
                };
            } )
            .catch( reject );
    } );
}

function drawAccessory ( scaleFactor, context, featureRect, faceIndex ) {

    var accessory;

    if ( faceAccessoriesRandomisedIndex.length <= faceIndex ) {
        while ( faceAccessoriesRandomisedIndex.length <= faceIndex ) {
            faceAccessoriesRandomisedIndex.push( getRandomizedAccessoryIndex() );
        }
    }

    accessory = faceAccessoriesLoaded[ faceAccessoriesRandomisedIndex[ faceIndex ] ];

    context.drawImage( accessory,
            featureRect.x * scaleFactor,
            featureRect.y * scaleFactor,
            featureRect.width * scaleFactor,
            Math.floor( ( featureRect.width * scaleFactor / accessory.width ) * accessory.height ) );
}

function drawFrame ( canvas, context ) {

    var frame;

    if ( imageFramesRandomisedIndex.length <= 0 ) {
        while ( imageFramesRandomisedIndex.length <= 0 ) {
            imageFramesRandomisedIndex.push( getRandomizedFrameIndex() );
        }
    }

    frame = imageFramesLoaded[ imageFramesRandomisedIndex[ 0 ] ];

    context.drawImage( frame, 0, 0, canvas.width, canvas.height );
}


function getRandomizedAccessoryIndex () {

    return Math.floor( Math.random() * faceAccessoriesLoaded.length );
}

function getRandomizedFrameIndex () {

    return Math.floor( Math.random() * imageFramesLoaded.length );
}

function preloadAssets ( assets ) {

    var promises = assets.map( function ( asset ) {

        return new Promise( function ( resolve, reject ) {

            var loadedAsset = new Image();

            loadedAsset.addEventListener( 'load', function () {
                resolve( loadedAsset );
            });

            loadedAsset.addEventListener( 'error', function () {
                reject();
            });

            loadedAsset.src = 'assets/'+ asset;
        });
    });

    return Promise.all( promises );
}

function resetRandomizedAccessoryIndices () {
    faceAccessoriesRandomisedIndex = [];
}

function resetRandomizedFrameIndices () {
    imageFramesRandomisedIndex = [];
}

export default Vue.component( 'recorder', {
    template: recorderTemplate,
    data: function () {
        return {
            available: false,
            active: false,
            lastSnapshot: null,
            recordNow: false,
            trackerStarted: false
        };
    },

    created: function () {
        preloadAssets( faceAccessories ).then( function ( preloaded ) {

            faceAccessoriesLoaded = preloaded;

        } ).then( preloadAssets.bind( preloadAssets, imageFrames ) )
            .then( function ( preloaded ) {
                imageFramesLoaded = preloaded;
            })
            .then( function () {

                this.available = true;

            }.bind( this ) );
    },

    computed: {
        snapshotActionsActive: function () {
            return !!this.lastSnapshot;
        }
    },

    methods: {

        deactivate: function () {
            this.active = false;
            this.$emit('deactivated');
        },

        eraseLastSnapshot: function () {
            if ( this.lastSnapshot ) {
                this.lastSnapshot = null;
                document.querySelector('.recorder-snapshot').style.backgroundImage ='';
            }
        },

        record: function () {

            if ( this.active ) {

                this.recordNow = true;

            } else {
                this.$emit('activated');
                this.active = true;

                if ( ! this.trackerStarted ) {
                    this.trackerStarted = true;
                    this.startTracking();
                }
            }
        },

        saveLastSnapshot: function () {

            if ( this.lastSnapshot ) {

                var request = new XMLHttpRequest();
                request.open('POST', '/upload', true);
                request.setRequestHeader('Content-Type', 'text/plain; charset=UTF-8');

                request.onload = function () {

                    this.eraseLastSnapshot();
                    this.$emit('saved');

                }.bind( this );

                request.onerror = function () {

                    this.eraseLastSnapshot();
                    this.$emit('saved');
                }.bind( this );

                request.send( this.lastSnapshot.src );
            }
        },

        startTracking: function () {

            var video = document.getElementById( 'video' );
            var canvas = document.getElementById( 'canvas' );
            var context = canvas.getContext( '2d' );
            var tracker = new tracking.ObjectTracker( 'face' );
            var gui;

            drawFrame( canvas, context );

            tracker.setInitialScale( 2 );
            tracker.setStepSize( 2 );
            tracker.setEdgesDensity( 0.05 );
            tracker.on( 'track', function ( event ) {

                context.clearRect( 0, 0, canvas.width, canvas.height );

                event.data.forEach( drawAccessory.bind( drawAccessory, 1, context ) );

                drawFrame( canvas, context ); // draw frame last :)

                if ( this.recordNow ) {
                    this.takeSnapshot( event.data );
                    this.recordNow = false;
                }
            }.bind( this ) );

            tracking.track( '#video', tracker, { camera: true } );

            gui = new dat.GUI();

            gui.add( tracker, 'edgesDensity', 0.05, 0.5 ).step( 0.01 );
            gui.add( tracker, 'initialScale', 1.0, 10.0 ).step( 0.1 );
            gui.add( tracker, 'stepSize', 1, 5 ).step( 0.1 );

            gui.add( { randomizeMustaches: resetRandomizedAccessoryIndices }, 'randomizeMustaches' );

            gui.add( { randomizeFrame: resetRandomizedFrameIndices }, 'randomizeFrame' );
        },

        takeSnapshot: function ( featureData ) {
            var recorded = document.querySelector('.recorder-snapshot');
            var recordCanvas = document.createElement('canvas');
            var recordContext = recordCanvas.getContext('2d');
            var canvas = document.getElementById( 'canvas' );
            var video = document.getElementById( 'video' );

            captureHighQualityVideoFrame().then( function ( highQualityVideo ) {

                var scaleFactor = highQualityVideo.width / video.width;

                recordCanvas.width = highQualityVideo.width;
                recordCanvas.height = highQualityVideo.height;

                recordContext.clearRect( 0, 0, recordCanvas.width, recordCanvas.height );
                recordContext.drawImage( highQualityVideo, 0, 0, recordCanvas.width, recordCanvas.height );

                featureData.forEach( function ( featureRect, faceIndex ) {
                    drawAccessory( scaleFactor, recordContext, featureRect, faceIndex );
                } );

                drawFrame( recordCanvas, recordContext );

                recorded.style.backgroundImage = 'url(\''+ recordCanvas.toDataURL().replace(/(\r\n|\n|\r)/gm, '') +'\')';

                this.lastSnapshot = new Image();
                this.lastSnapshot.src = recordCanvas.toDataURL('image/png');
            }.bind( this ) );
        }
    }
});