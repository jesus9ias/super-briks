<template>
  <div class="scenario">
    <p>Total Bubbles: {{ bubbles.length }}</p>
    <div
      ref="scenario"
      class="scenario__container"
      :style="style"
    >
      <the-brik
        v-for="brik in briks"
        :key="brik.id"
        :self-brik="brik"
      />

      <the-bubble
        v-for="(bubble, i) in bubbles"
        :key="i"
        :self-bubble="bubble"
      />

      <the-hit />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import {
  Watch,
} from 'vue-property-decorator';
import loadedGame from '../../../games/game2.json';
import {
  BRIK_LENGTH,
  SCENARIO_ROWS,
  ANGLE_REFERENCE,
  BUBBLE_DIAMETER,
  SCENARIO_COLUMNS,
  MAX_ALLOWED_BUBBLES,
  BUBBLE_CREATION_FACTOR,
  CONTINUOUS_CREATE_BUBBLES,
} from './constants';
import TheHit from './elements/TheHit.vue';
import TheBrik from './elements/TheBrik.vue';
import TheBubble from './elements/TheBubble.vue';
import Brik from './models/Brik';
import Bubble from './models/Bubble';
import GameBrikInterface from './interfaces/GameBrik';
import state from './state';

@Options({
  data() {
    return {
      loadedGame,
    };
  },
  components: {
    TheHit,
    TheBrik,
    TheBubble,
  },
})
export default class Scenario extends Vue {
  $refs!: {
    scenario: HTMLFormElement;
  };

  private readonly scenarioWidth = SCENARIO_COLUMNS * BRIK_LENGTH;
  private readonly scenarioHeight = SCENARIO_ROWS * BRIK_LENGTH;
  private readonly atMiddleScenario = 2;

  private bubbleBase = {
    top: this.scenarioHeight - BUBBLE_DIAMETER,
    left: (this.scenarioWidth / this.atMiddleScenario) - (BUBBLE_DIAMETER / 2),
    angle: 90,
  };

  get bubbles() {
    return state.bubbles;
  }

  get briks() {
    return state.briks;
  }

  get cicle() {
    return state.cicle;
  }

  get style() {
    return {
      width: `${this.scenarioWidth}px`,
      height: `${this.scenarioHeight}px`,
    };
  }

  @Watch('cicle')
  cicleChanged() {
    if (this.cicle % BUBBLE_CREATION_FACTOR === 0) {
      if (CONTINUOUS_CREATE_BUBBLES) {
        this.createBubble();
        this.removeLastBubbleIfPossible();
      } else if (state.bubbles.length < MAX_ALLOWED_BUBBLES) {
        this.createBubble();
      }
    }
  }

  created() {
    this.loadBriks();
    this.createBubble();
  }

  mounted() {
    this.$refs.scenario.addEventListener('mousemove', this.updateStartAngle);
  }

  private createBubble() {
    const bubble = new Bubble(this.bubbleBase);
    state.bubbles.push(bubble);
  }

  private removeLastBubbleIfPossible() {
    if (state.bubbles.length > MAX_ALLOWED_BUBBLES) {
      state.bubbles.shift();
    }
  }

  private updateStartAngle(event: MouseEvent) {
    const deltaY = event.offsetY - this.scenarioHeight;
    const deltaX = event.offsetX - this.scenarioWidth / this.atMiddleScenario;
    const radiansToDegrees = (ANGLE_REFERENCE / Math.PI);
    const angle = Math.abs(Math.atan2(deltaY, deltaX) * radiansToDegrees);
    this.bubbleBase.angle = angle;
  }

  private loadBriks() {
    loadedGame.briks.forEach((gameBrik: GameBrikInterface) => {
      state.briks.push(new Brik(gameBrik));
    });
  }
}
</script>

<style scoped lang="scss">
  .scenario__container {
    position: relative;
    margin: auto;
    border: 1px solid black;
  }
</style>
