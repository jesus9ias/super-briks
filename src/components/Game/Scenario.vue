<template>
  <div class="scenario">
   <brik top="0" left="0" />
   <brik top="1" left="0" />
   <brik top="2" left="0" />
   <brik top="0" left="1" />
   <brik top="1" left="1" />
   <brik top="2" left="1" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Brik from './Brik.vue';

@Options({
  components: {
    Brik,
  },
})
export default class Scenario extends Vue {
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
