<div class="slide" v-bind:style="slideStyle">
    <div class="slide-actions"
        v-bind:class="{ 'slide-actions-active': active }"
        >
        <div
            v-on:click="erase"
            v-on:keyup.69="erase"
            class="slide-action slide-action-erase icon-trash"></div>
    </div>
</div>