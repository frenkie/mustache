import Vue from 'vue';


export default Vue.component( 'loader', {
    template: '<div class="loader" v-bind:class="{ \'loader-active\': active }"></div>',
    props: ['active']
});