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
  Watch,
} from 'vue-property-decorator';
import { Vue } from 'vue-class-component';
import state from './state';
import bubbleStage from './bubbleState';
import { HitAngleFactor } from './HitAngleFactor';

export default class Bubble extends Vue {
  @Prop({ default: 0 }) angle!: number;

  scenarioWidth = 1000;
  scenarioHeight = 500;
  diameter = 10;

  readonly moveFactor = 1;

  get style() {
    return {
      top: `${bubbleStage.top}px`,
      left: `${bubbleStage.left}px`,
    };
  }

  created() {
    bubbleStage.top = 490;
    bubbleStage.left = 495;
    bubbleStage.angle = this.angle;
  }

  get xMovement() {
    return this.moveFactor * Math.cos(bubbleStage.angle * (Math.PI / 180));
  }

  get yMovement() {
    return this.moveFactor * Math.sin(bubbleStage.angle * (Math.PI / 180));
  }

  get cicle() {
    return state.cicle;
  }

  get lastAngleFactor() {
    return bubbleStage.lastAngleFactor;
  }

  private moveBubble() {
    bubbleStage.top -= this.yMovement;
    bubbleStage.left += this.xMovement;
  }

  private hitScenarioBorder() {
    const northHit = bubbleStage.top <= 0;
    const southHit = bubbleStage.top > this.scenarioHeight - this.diameter;
    const eastHit = bubbleStage.left <= 0;
    const westHit = bubbleStage.left > this.scenarioWidth - this.diameter;
    if (northHit) {
      this.changeAngleAfterBorderHit(HitAngleFactor.NORTH);
    }
    if (southHit) {
      this.changeAngleAfterBorderHit(HitAngleFactor.SOUTH);
    }
    if (eastHit) {
      this.changeAngleAfterBorderHit(HitAngleFactor.EAST);
    }
    if (westHit) {
      this.changeAngleAfterBorderHit(HitAngleFactor.WEST);
    }
  }

  private changeAngleAfterBorderHit(angleFactor: HitAngleFactor) {
    bubbleStage.angle = angleFactor + 180 + (angleFactor - bubbleStage.angle);
  }

  @Watch('cicle')
  cicleChanged() {
    this.moveBubble();
    this.hitScenarioBorder();
  }

  @Watch('lastAngleFactor')
  lastAngleFactorChanged() {
    this.changeAngleAfterBorderHit(bubbleStage.lastAngleFactor);
  }
}
</script>

<style scoped lang="scss">
  .bubble {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid red;
  }
</style>
