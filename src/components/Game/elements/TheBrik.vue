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
import {
  BRIK_LENGTH,
} from '../constants';
import Brik from '../models/Brik';

export default class TheBrik extends Vue {
  @Prop({ required: true }) selfBrik!: Brik;

  get calculatedTop() {
    return this.selfBrik.top * BRIK_LENGTH;
  }

  get calculatedLeft() {
    return this.selfBrik.left * BRIK_LENGTH;
  }

  get style() {
    return {
      top: `${this.calculatedTop}px`,
      left: `${this.calculatedLeft}px`,
      width: `${BRIK_LENGTH}px`,
      height: `${BRIK_LENGTH}px`,
      lineHeight: `${BRIK_LENGTH}px`,
    };
  }
}
</script>

<style scoped lang="scss">
  .brik {
    position: absolute;
    font-size: 9px;
    text-align: center;
    border: 1px solid black;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }
</style>
