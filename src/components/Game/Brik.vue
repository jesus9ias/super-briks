<template>
  <div
    class="brik"
    :style="style"
  >
   {{ currentScore }}
  </div>
</template>

<script lang="ts">
import {
  Prop,
  Watch,
} from 'vue-property-decorator';
import { Vue } from 'vue-class-component';
import state from './state';
import bubbleStage from './bubbleState';
import { HitAngleFactor } from './HitAngleFactor';

export default class Brik extends Vue {
  @Prop({ default: 1000 }) score!: number;
  @Prop({ default: 0 }) top!: number;
  @Prop({ default: 0 }) left!: number;

  public currentScore = 0;
  readonly brikLength = 20;

  get calculatedTop() {
    return this.top * this.brikLength;
  }

  get calculatedLeft() {
    return this.left * this.brikLength;
  }

  get style() {
    return {
      top: `${this.calculatedTop}px`,
      left: `${this.calculatedLeft}px`,
    };
  }

  get cicle() {
    return state.cicle;
  }

  get bubbleTop() {
    return bubbleStage.top;
  }

  get bubbleTopHeight() {
    return bubbleStage.top + 10;
  }

  get bubbleLeft() {
    return bubbleStage.left;
  }

  get bubbleLeftWidth() {
    return bubbleStage.left + 10;
  }

  get bubbleSideHits() {
    const northLine = this.bubbleTopHeight >= this.calculatedTop
      && this.bubbleTopHeight < this.calculatedTop + this.brikLength;

    const southLine = this.bubbleTop <= this.calculatedTop + this.brikLength
      && this.bubbleTop > this.calculatedTop;

    const eastLine = this.bubbleLeft <= this.calculatedLeft + this.brikLength
      && this.bubbleLeft > this.calculatedLeft;

    const westLine = this.bubbleLeftWidth >= this.calculatedLeft
      && this.bubbleLeftWidth < this.calculatedLeft + this.brikLength;

    const north = northLine && eastLine && westLine;
    const south = southLine && eastLine && westLine;
    const east = eastLine && northLine && southLine;
    const west = westLine && northLine && southLine;

    return {
      north,
      south,
      east,
      west,
    };
  }

  get isBubbleIn() {
    return this.bubbleSideHits.north
      || this.bubbleSideHits.south
      || this.bubbleSideHits.east
      || this.bubbleSideHits.west;
  }

  private hitByBubble() {
    if (this.bubbleSideHits.north) {
      this.changeBubbleAngle(HitAngleFactor.SOUTH);
    }
    if (this.bubbleSideHits.south) {
      this.changeBubbleAngle(HitAngleFactor.NORTH);
    }
    if (this.bubbleSideHits.east) {
      this.changeBubbleAngle(HitAngleFactor.WEST);
    }
    if (this.bubbleSideHits.west) {
      this.changeBubbleAngle(HitAngleFactor.EAST);
    }

    this.updateBrikScore(-1);
  }

  private updateBrikScore(scoreToUpdate: number) {
    this.currentScore += scoreToUpdate;
  }

  private changeBubbleAngle(angleFactor: HitAngleFactor) {
    bubbleStage.lastAngleFactor = angleFactor;
  }

  @Watch('isBubbleIn')
  isBubbleInChanged() {
    if (this.isBubbleIn) {
      this.hitByBubble();
    }
  }

  created() {
    this.updateBrikScore(this.score);
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
