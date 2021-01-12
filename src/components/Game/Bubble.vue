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

enum HIT {
  NORTH = 1,
  SOUTH = 2,
  EAST = 3,
  WEST = 4
}

export default class Bubble extends Vue {
  @Prop({ default: 0 }) angle!: number;

  scenarioWidth = 1000;
  scenarioHeight = 500;
  top = 480;
  left = 490;
  diameter = 20;
  currentAngle = 0;

  readonly moveFactor = 1;

  get style() {
    return {
      top: `${this.top}px`,
      left: `${this.left}px`,
    };
  }

  created() {
    this.currentAngle = this.angle;
  }

  get xMovement() {
    return this.moveFactor * Math.cos(this.currentAngle * (Math.PI / 180));
  }

  get yMovement() {
    return this.moveFactor * Math.sin(this.currentAngle * (Math.PI / 180));
  }

  get cicle() {
    return state.cicle;
  }

  private moveBubble() {
    this.top -= this.yMovement;
    this.left += this.xMovement;
    //  console.log(this.left, this.top);
  }

  private hitScenarioBorder() {
    const northHit = this.top <= 0;
    const southHit = this.top > this.scenarioHeight - this.diameter;
    const eastHit = this.left <= 0;
    const westHit = this.left > this.scenarioWidth - this.diameter;
    if (northHit) {
      this.changeAngleAfterBorderHit(HIT.NORTH);
    }
    if (southHit) {
      this.changeAngleAfterBorderHit(HIT.SOUTH);
    }
    if (eastHit) {
      this.changeAngleAfterBorderHit(HIT.EAST);
    }
    if (westHit) {
      this.changeAngleAfterBorderHit(HIT.WEST);
    }
  }

  private changeAngleAfterBorderHit(borderHit: HIT) {
    if (borderHit === HIT.NORTH) {
      this.currentAngle = 270 + (90 - this.currentAngle);
    }
    if (borderHit === HIT.SOUTH) {
      this.currentAngle = 90 + (270 - this.currentAngle);
    }
    if (borderHit === HIT.EAST) {
      this.currentAngle = 180 + (360 - this.currentAngle);
    }
    if (borderHit === HIT.WEST) {
      this.currentAngle = 0 + (180 - this.currentAngle);
    }
  }

  @Watch('cicle')
  onPropertyChanged() {
    this.moveBubble();
    this.hitScenarioBorder();
  }
}
</script>

<style scoped lang="scss">
  .bubble {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid red;
  }
</style>
