<template>
  <div
    class="brik"
    :style="style"
  >
   {{ selfBrik.score }}
  </div>
</template>

<script lang="ts">
import {
  Prop,
} from 'vue-property-decorator';
import { Vue } from 'vue-class-component';
import Brik from '../models/Brik';

export default class TheBrik extends Vue {
  @Prop({ required: true }) selfBrik!: Brik;

  get calculatedTop() {
    return this.selfBrik.top * this.selfBrik.brikLength;
  }

  get calculatedLeft() {
    return this.selfBrik.left * this.selfBrik.brikLength;
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
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }
</style>
