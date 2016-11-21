import Vue from 'vue';
import Slide from './Slide.js';
import slideShowTemplate from '../templates/slideshow.vue!text';

/*

    Slideshow

    -   Make a slice of 8 pieces in the slideshow (if there are
    -   When 1 moves out, move the next one 1

 */

export default Vue.component( 'slide-show', {

    template: slideShowTemplate,

    data: function () {

        return {
            activePanelIndex: -1,
            panelCount: 8,
            reset: false,
            showTime: 4000,
            slideSelection: [],
            slideWidth: 640,
            shiftInsertIndex: 0,
            shiftSlideIndex: -1
        };
    },

    props: ['slides', 'active', 'paused'],

    computed: {

        panelRotation: function () {
            return Math.floor( 360 / this.panelCount );
        },

        panelTranslation: function () {
            return Math.floor( Math.round( ( this.slideWidth / 2 ) / Math.tan( Math.PI / this.slideSelection.length ) ) ) + 15; // some extra translation for visual space
        },

        containerStyles: function () {

            var rotation = 0;

            if ( this.activePanelIndex > -1 ) {
                rotation = -1 * this.activePanelIndex * this.panelRotation;
            }

            return {
                transform: 'translateZ(' + ( -1 * this.panelTranslation ) + 'px) rotateY(' + rotation + 'deg)'
            };
        }
    },

    created: function () {

        for ( var i=0, il = this.panelCount; i < il; i++ ) {

            this.slideSelection.push( '' );
        }
    },

    methods: {

        getNextPanelIndex: function () {
            var nextIndex;
            var slideSelection = this.slideSelection;

            if ( this.activePanelIndex === slideSelection.length-1 ) {

                nextIndex = 0;

            } else {

                for ( var i = this.activePanelIndex+1, il = slideSelection.length; i < il; i++ ) {
                    if ( slideSelection[ i ] !== '' ) {
                        nextIndex = i;
                        break;
                    }
                }
            }

            if ( typeof nextIndex === 'undefined' ) {
                nextIndex = 0;
            }

            return nextIndex;
        },

        rotate: function () {

            var nextIndex;

            console.log( 'interval!' );

            if ( ! this.paused ) {

                nextIndex = this.getNextPanelIndex();

                if ( nextIndex >= 4 && this.shiftSlideIndex === -1 && this.slides.length > this.panelCount ) {
                    // first time shifting
                    this.shiftSlideIndex = this.panelCount;
                }

                if ( this.shiftSlideIndex > -1 ) {
                    this.shiftSlides();
                }

                if ( nextIndex === 0 ) {
                    this.activePanelIndex = this.panelCount; // make a nice full circle
                    setTimeout( function () {

                        this.reset = true;
                        this.activePanelIndex = 0;

                    }.bind( this ), 1000 );
                } else {
                    this.reset = false;
                    this.activePanelIndex = nextIndex;
                }
            }

            setTimeout( this.rotate.bind( this ), this.showTime );
        },

        shiftSlides: function () {
            /*
                Only if slides.length > panelCount

                we have a shift index : which position in the carousel to replace
                we have a slide index : which slide to push


             */
        }
    },

    watch: {

        slides: function ( val ) {

            if ( this.activePanelIndex === -1 ) {

                for ( var i=0, il = 8; i < il; i++ ) {
                    if ( this.slides.length > i ) {
                        this.slideSelection[ i ] = this.slides[ i ];
                    }
                }

                this.activePanelIndex = 0;

                // start rotating and shifting.
                this.paused = false;
                setTimeout( this.rotate.bind( this ), this.showTime );
            } else {

                if ( val.length <= this.panelCount ) {
                    for ( var i=0, il = 8; i < il; i++ ) {
                        if ( val.length > i ) {
                            this.slideSelection[ i ] = val[ i ];
                        }
                    }
                }
            }
        }
    }
});