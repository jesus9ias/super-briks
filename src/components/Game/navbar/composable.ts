import {
  computed,
} from 'vue';
import state from '../state';
import {
  CICLES_PER_SECOND,
  MAX_ALLOWED_BUBBLES,
} from '../constants';
import AGame from '../interfaces/AGame';

export default (theGame: AGame) => {
  const totalBubbles = MAX_ALLOWED_BUBBLES;

  const bubbles = computed(() => state.bubbles);
  const briks = computed(() => state.briks);
  const removedbriks = computed(() => theGame.briks.length - state.briks.length);
  const earnedPoints = computed(() => state.earnedPoints);

  const bubbleStatClass = computed(() => (state.bubbles.length < totalBubbles ? 'navbar__stat--good' : 'navbar__stat--bad'));

  const brikStatClass = computed(() => (state.briks.length === 0 ? 'navbar__stat--good' : 'navbar__stat--bad'));

  const elapsedSeconds = computed(() => state.cicle / CICLES_PER_SECOND);

  return {
    briks,
    bubbles,
    earnedPoints,
    removedbriks,
    totalBubbles,
    brikStatClass,
    elapsedSeconds,
    bubbleStatClass,
  };
};
