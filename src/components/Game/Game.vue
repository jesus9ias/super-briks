<template>
  <div class="game">
    <navbar :the-game="theGame" />
    <scenario :the-game="theGame" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import loadedGame from '../../../games/game3.json';
import Navbar from './navbar/Navbar.vue';
import Scenario from './scenario/Scenario.vue';
import Timer from './Timer';

@Options({
  components: {
    Navbar,
    Scenario,
  },
})
export default class Game extends Vue {
  public theGame = loadedGame;
  private timer = new Timer();

  created() {
    this.timer.startGame();
  }
}
</script>

<style scoped lang="scss">
</style>
