<template>
  <div class="scenario">
   <brik
    v-for="brik in loadedGame.briks"
    :key="brik.id"
    :top="brik.top"
    :left="brik.left"
    :score="brik.score"
  />

   <bubble
    :angle="startAngle"
    :briks="loadedGame.briks"
  />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import loadedGame from '../../../games/game3.json';
import Brik from './Brik.vue';
import Bubble from './Bubble.vue';

@Options({
  data() {
    return {
      loadedGame,
    };
  },
  components: {
    Brik,
    Bubble,
  },
})
export default class Scenario extends Vue {
  public startAngle = 93;
}
</script>

<style scoped lang="scss">
  .scenario {
    position: relative;
    margin: auto;
    width: 1000px;
    height: 500px;
    border: 1px solid black;
  }
</style>
