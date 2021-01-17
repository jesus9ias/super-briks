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
import {
  BRIK_LENGTH,
  SCENARIO_ROWS,
  ANGLE_REFERENCE,
  BUBBLE_DIAMETER,
  SCENARIO_COLUMNS,
  BUBBLE_MOVE_FACTOR,
} from '../constants';

export default class TheBubble extends Vue {
  @Prop({ required: true }) selfBubble!: Bubble;

  private readonly scenarioWidth = SCENARIO_COLUMNS * BRIK_LENGTH;
  private readonly scenarioHeight = SCENARIO_ROWS * BRIK_LENGTH;

  get style() {
    return {
      top: `${this.selfBubble.top}px`,
      left: `${this.selfBubble.left}px`,
      width: `${BUBBLE_DIAMETER}px`,
      height: `${BUBBLE_DIAMETER}px`,
    };
  }

  get xMovement() {
    return BUBBLE_MOVE_FACTOR * Math.cos(this.selfBubble.angle * (Math.PI / ANGLE_REFERENCE));
  }

  get yMovement() {
    return BUBBLE_MOVE_FACTOR * Math.sin(this.selfBubble.angle * (Math.PI / ANGLE_REFERENCE));
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
    const angleChange = angleFactor + ANGLE_REFERENCE;
    this.selfBubble.angle = angleChange + (angleFactor - this.selfBubble.angle);
  }
}
</script>

<style scoped lang="scss">
  .bubble {
    position: absolute;
    border-radius: 50%;
    border: 1px solid red;
  }
</style>
