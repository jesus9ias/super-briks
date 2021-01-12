import { reactive } from 'vue';
import { HitAngleFactor } from './HitAngleFactor';

// reactive state
const state = reactive({
  left: 0,
  top: 0,
  angle: 0,
  lastAngleFactor: HitAngleFactor.NONE,
});

export default state;
