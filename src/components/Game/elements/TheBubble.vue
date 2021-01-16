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
import Bubble from '../models/Bubble';
import { HitAngleFactor } from '../enums/HitAngleFactor';
import state from '../state';

export default class TheBubble extends Vue {
  @Prop({ required: true }) selfBubble!: Bubble;

  private scenarioWidth = 1000;
  private scenarioHeight = 500;

  private readonly moveFactor = 5;

  get style() {
    return {
      top: `${this.selfBubble.top}px`,
      left: `${this.selfBubble.left}px`,
    };
  }

  get xMovement() {
    return this.moveFactor * Math.cos(this.selfBubble.angle * (Math.PI / 180));
  }

  get yMovement() {
    return this.moveFactor * Math.sin(this.selfBubble.angle * (Math.PI / 180));
  }

  get cicle() {
    return state.cicle;
  }

  get lastAngleFactor() {
    return this.selfBubble.lastAngleFactor;
  }

  @Watch('cicle')
  cicleChanged() {
    this.selfBubble.moveBubble(this.xMovement, this.yMovement);
    this.hitScenarioBorder();
  }

  @Watch('lastAngleFactor')
  lastAngleFactorChanged() {
    this.changeAngleAfterBorderHit(this.selfBubble.lastAngleFactor);
  }

  private hitScenarioBorder() {
    const northHit = this.selfBubble.top <= 0;
    const southHit = this.selfBubble.top > this.scenarioHeight - this.selfBubble.diameter;
    const eastHit = this.selfBubble.left <= 0;
    const westHit = this.selfBubble.left > this.scenarioWidth - this.selfBubble.diameter;
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
    this.selfBubble.angle = angleFactor + 180 + (angleFactor - this.selfBubble.angle);
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
