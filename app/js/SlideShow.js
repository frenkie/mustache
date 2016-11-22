import Vue from 'vue';
import Slide from './Slide.js';
import slideShowTemplate from '../templates/slideshow.vue!text';

export default Vue.component( 'slide-show', {

    template: slideShowTemplate,

    data: function () {

        return {
            activePanelIndex: -1,
            panelCount: 8,
            reset: false,
            rotateInterval: null,
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

        eraseSlide: function ( slidePath ) {
            this.$emit( 'erase-slide', slidePath );
        },

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
        },

        shiftSlides: function () {

            console.log( 'inserting slide '+ ( this.shiftSlideIndex + 1 ) + ' on panel position '+ this.shiftInsertIndex );
            this.slideSelection[ this.shiftInsertIndex ] = this.slides[ this.shiftSlideIndex ];

            this.shiftSlideIndex++;
            if ( this.shiftSlideIndex >= this.slides.length ) {
                this.shiftSlideIndex = 0;
            }

            this.shiftInsertIndex++;
            if ( this.shiftInsertIndex >= this.panelCount ) {
                this.shiftInsertIndex = 0;
            }
        }
    },

    watch: {

        slides: function ( val ) {

            var newSlideSelection = [];
            var i=0;
            while ( i < this.panelCount ) {
                newSlideSelection.push( '' );
                i++;
            }

            if ( this.activePanelIndex === -1 ) {

                for ( var j=0, jl = 8; j < jl; j++ ) {
                    if ( this.slides.length > j ) {
                        newSlideSelection[ j ] = this.slides[ j ];
                    }
                }

                this.slideSelection = newSlideSelection;
                this.activePanelIndex = 0;

                // start rotating and shifting.
                this.paused = false;
                this.rotateInterval = setInterval( this.rotate.bind( this ), this.showTime );

            } else {

                clearInterval( this.rotateInterval );

                for ( var i=0, il = 8; i < il; i++ ) {
                    if ( val.length > i ) {
                        newSlideSelection[ i ] = val[ i ];
                    }
                }

                this.slideSelection = newSlideSelection;
                this.reset = true;
                this.shiftInsertIndex = 0;
                this.shiftSlideIndex = -1;
                this.activePanelIndex = 0;

                this.rotateInterval = setInterval( this.rotate.bind( this ), this.showTime );
            }
        }
    }
});