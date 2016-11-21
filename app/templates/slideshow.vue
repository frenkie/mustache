<div class="slide-show"
     v-bind:class="{ 'slide-show-active': active }">
    <div class="slide-show-slides" v-bind:style="containerStyles">
        <slide v-for="(slide, index) in slideSelection"
               v-bind:img="slide"
               v-bind:rotation="panelRotation * index"
               v-bind:translation="panelTranslation"></slide>
    </div>
</div>