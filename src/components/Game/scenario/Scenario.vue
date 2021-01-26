<template>
  <div class="scene">
    <p>Total Bubbles: {{ scene.bubbles.length }}</p>
    <div
      ref="scenario"
      class="scenario__container"
      :style="scene.style"
    >
      <the-brik
        v-for="brik in scene.briks"
        :key="brik.id"
        :self-brik="brik"
      />

      <the-bubble
        v-for="(bubble, i) in scene.bubbles"
        :key="i"
        :self-bubble="bubble"
      />

      <the-hit />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, setup, Vue } from 'vue-class-component';
import TheHit from '../elements/TheHit.vue';
import TheBrik from '../elements/TheBrik.vue';
import TheBubble from '../elements/TheBubble.vue';
import ScenarioComposable from './composable';

@Options({
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

  public scene = setup(() => ScenarioComposable());

  mounted() {
    this.$refs.scenario.addEventListener('mousemove', this.scene.updateStartAngle);
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
