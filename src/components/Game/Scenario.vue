<template>
  <div class="scenario">
    <p>Total Bubbles: {{ bubbles.length }}</p>
    <div class="scenario__container">
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
import loadedGame from '../../../games/game4.json';
import TheHit from './elements/TheHit.vue';
import TheBrik from './elements/TheBrik.vue';
import TheBubble from './elements/TheBubble.vue';
import Brik from './models/Brik';
import Bubble from './models/Bubble';
import GameBrikInterface from './interfaces/GameBrik';
import state from './state';

const bubbleBase = {
  top: 490,
  left: 495,
  angle: 135,
};

const bubbleCreationFactor = 10;
const maxAllowedBubbles = 101;

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
  get bubbles() {
    return state.bubbles;
  }

  get briks() {
    return state.briks;
  }

  get cicle() {
    return state.cicle;
  }

  @Watch('cicle')
  cicleChanged() {
    if (this.cicle % bubbleCreationFactor === 0) {
      this.createBubble();
      this.removeLastBubbleIfPossible();
    }
  }

  created() {
    this.loadBriks();
    this.createBubble();
  }

  private createBubble() {
    const bubble = new Bubble(bubbleBase);
    state.bubbles.push(bubble);
  }

  private removeLastBubbleIfPossible() {
    if (state.bubbles.length === maxAllowedBubbles) {
      state.bubbles.shift();
    }
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
    width: 1000px;
    height: 500px;
    border: 1px solid black;
  }
</style>
