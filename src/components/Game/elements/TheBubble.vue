<template>
  <div
    class="bubble"
    :style="style"
  >
  </div>
</template>

<script lang="ts">
import {
  Prop,
} from 'vue-property-decorator';
import { Vue } from 'vue-class-component';
import Bubble from '../models/Bubble';

export default class TheBubble extends Vue {
  @Prop({ required: true }) selfBubble!: Bubble;

  get style() {
    return {
      top: `${this.selfBubble.top}px`,
      left: `${this.selfBubble.left}px`,
      width: `${this.selfBubble.diameter}px`,
      height: `${this.selfBubble.diameter}px`,
      backgroundColor: this.selfBubble.background,
    };
  }
}
</script>

<style scoped lang="scss">
  .bubble {
    position: absolute;
    border-radius: 50%;
    border: 1px solid black;
  }
</style>
