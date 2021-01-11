<template>
  <div class="home">
    <game />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Game from '@/components/Game/Game.vue';

@Options({
  components: {
    Game,
  },
})
export default class Home extends Vue {}
</script>
