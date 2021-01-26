import { reactive } from 'vue';
import Bubble from './models/Bubble';
import Brik from './models/Brik';

const voidBubbles: Bubble[] = [];
const voideBriks: Brik[] = [];

const state = reactive({
  cicle: 0,
  bubbles: voidBubbles,
  briks: voideBriks,
  earnedPoints: 0,
});

export default state;
