import Vue from 'vue';
import Loader from './Loader.js';
import SlideShow from './SlideShow.js';
import BigButton from './BigButton.js';
import Recorder from './Recorder.js';


var Mustache = Vue.extend({

    data: function () {
        return {
            loaderIsActive: true,
            recorderIsActive: false,
            slideShowIsActive: true,
            slides: []

        };
    },

    mounted: function () {
        this.fetchSlides();
    },

    methods: {

        eraseSlide: function ( slidePath ) {
            this.loaderIsActive = true;

            var request = new XMLHttpRequest();
            request.open('GET', '/erase/'+ slidePath.split('/').pop(), true );

            request.onload = function () {
                if ( request.status >= 200 && request.status < 400 ) {
                    this.loaderIsActive = false;
                    this.fetchSlides();
                }

            }.bind( this );

            request.onerror = function () {
                this.loaderIsActive = false;
            }.bind( this );

            request.send();
        },

        fetchSlides: function () {

            this.loaderIsActive = true;

            var request = new XMLHttpRequest();
            request.open('GET', '/list', true );

            request.onload = function () {
                if ( request.status >= 200 && request.status < 400 ) {
                    this.slides = JSON.parse( request.responseText );
                    this.loaderIsActive = false;
                }

            }.bind( this );

            request.onerror = function () {
                this.loaderIsActive = false;
            }.bind( this );

            request.send();
        },

        onRecorderActivated: function () {
            this.recorderIsActive = true;
        },

        onRecorderDeActivated: function () {
            this.recorderIsActive = false;
        },

        onImageRecorded: function () {
            this.fetchSlides();
        }
    }
});

export default Mustache;