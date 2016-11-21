<div class="recorder">
    <big-button v-on:click.native="record" v-bind:class="{ 'recorder-available': available }"></big-button>

    <div class="recorder-container" v-bind:class="{ 'recorder-container-active': active }">

        <span class="recorder-container-close icon-close" v-on:click="deactivate"></span>

        <div class="recorder-frame-grabber">
          <video id="video" width="320" height="240" preload autoplay loop muted></video>
          <canvas id="canvas" width="320" height="240"></canvas>
        </div>

        <div class="recorder-snapshot">
            <div class="recorder-snapshot-actions"
                v-bind:class="{ 'recorder-snapshot-actions-active': snapshotActionsActive }"
                >
                <div
                        v-on:click="saveLastSnapshot"
                        class="recorder-snapshot-action recorder-snapshot-save icon-check"></div>
                <div
                        v-on:click="eraseLastSnapshot"
                        class="recorder-snapshot-action recorder-snapshot-erase icon-trash"></div>
            </div>
        </div>
    </div>
</div>