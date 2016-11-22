import Vue from 'vue';
import slideTemplate from '../templates/slide.vue!text';

export default Vue.component( 'slide', {
    template: slideTemplate,
    props: ['img', 'translation', 'rotation', 'active'],

    computed: {
        slideStyle: function () {
            return {
                backgroundImage: ( this.img !== '' ) ? 'url("'+ this.img +'")' : '',
                transform : 'rotateY('+ this.rotation +'deg) translateZ('+ ( this.translation ) +'px)'
            }
        }
    },

    methods: {
        erase: function () {
            this.$emit( 'erase', this.img )
        }
    }
});