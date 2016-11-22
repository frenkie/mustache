<div class="slide-show"
     v-bind:class="{ 'slide-show-active': active }">
    <div class="slide-show-slides"
        v-bind:class="{ 'slide-show-slide-reset': reset }"
        v-bind:style="containerStyles">
        <slide v-for="(slide, index) in slideSelection"
               v-on:erase="eraseSlide"
               v-bind:img="slide"
               v-bind:active="index == activePanelIndex"
               v-bind:rotation="panelRotation * index"
               v-bind:translation="panelTranslation"></slide>
    </div>
</div>