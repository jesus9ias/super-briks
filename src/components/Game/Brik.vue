<template>
  <div
    class="brik"
    :style="style"
  >
   {{ score }}
  </div>
</template>

<script lang="ts">
import {
  Prop,
} from 'vue-property-decorator';
import { Vue } from 'vue-class-component';
import state from './state';

export default class Brik extends Vue {
  @Prop({ default: 1000 }) score!: number;
  @Prop({ default: 0 }) top!: number;
  @Prop({ default: 0 }) left!: number;

  gameState = state;

  get calculatedTop() {
    return this.top * 20;
  }

  get calculatedLeft() {
    return this.left * 20;
  }

  get style() {
    return {
      top: `${this.calculatedTop}px`,
      left: `${this.calculatedLeft}px`,
    };
  }
}
</script>

<style scoped lang="scss">
  .brik {
    position: absolute;
    width: 20px;
    height: 20px;
    line-height: 20px;
    font-size: 9px;
    text-align: center;
    border: 1px solid black;
  }
</style>
