<template>
  <div class="navbar">
    <p class="navbar__title">Super Briks // The Game</p>
    <p
      class="navbar__stat"
      :class="nav.bubbleStatClass"
    >
      Bubbles {{ nav.bubbles.length }}/{{ nav.totalBubbles }}
    </p>
    <p
      class="navbar__stat"
      :class="nav.brikStatClass"
    >
      Briks {{ nav.removedbriks }}/{{ theGame.briks.length }}
    </p>
    <p class="navbar__stat navbar__stat--info">Points {{ nav.earnedPoints }}</p>
    <p class="navbar__stat navbar__stat--info">Time Elapsed {{ nav.elapsedSeconds }}</p>
  </div>
</template>

<script lang="ts">
import { Prop } from 'vue-property-decorator';
import { Options, setup, Vue } from 'vue-class-component';
import AGame from '../interfaces/AGame';
import NavbarComposable from './composable';

@Options({})
export default class Navbar extends Vue {
  @Prop({ required: true }) theGame!: AGame;

  public nav = setup(() => NavbarComposable(this.theGame));
}
</script>

<style scoped lang="scss">
  .navbar {
    padding: 20px;
    background: lightslategray;
    &__title,
    &__stat {
      margin: 0px 5px;
      display: inline-block;
    }
    &__title {
      font-size: 20px;
      color: white;
    }
    &__stat {
      font-size: 16px;
      color: white;
    }
    &__stat--good {
      color: lawngreen;
    }
    &__stat--bad {
      color: orangered;
    }
    &__stat--info {
      color: cyan;
    }
  }
</style>
