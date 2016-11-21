import Vue from 'vue';

export default Vue.component( 'slide', {
    template: '<div class="slide" v-bind:style="slideStyle"></div>',
    props: ['img', 'translation', 'rotation'],

    computed: {
        slideStyle: function () {
            return {
                backgroundImage: ( this.img !== '' ) ? 'url("'+ this.img +'")' : '',
                transform : 'rotateY('+ this.rotation +'deg) translateZ('+ ( this.translation ) +'px)'
            }
        }
    }
});