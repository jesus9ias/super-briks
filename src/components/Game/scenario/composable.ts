import {
  ref,
  watch,
  computed,
  onMounted,
} from 'vue';
import loadedGame from '../../../../games/game2.json';
import Brik from '../models/Brik';
import Bubble from '../models/Bubble';
import GameBrikInterface from '../interfaces/GameBrik';
import {
  BRIK_LENGTH,
  SCENARIO_ROWS,
  ANGLE_REFERENCE,
  BUBBLE_DIAMETER,
  SCENARIO_COLUMNS,
  MAX_ALLOWED_BUBBLES,
  BUBBLE_CREATION_FACTOR,
  CONTINUOUS_CREATE_BUBBLES,
} from '../constants';
import state from '../state';

const scenarioWidth = SCENARIO_COLUMNS * BRIK_LENGTH;
const scenarioHeight = SCENARIO_ROWS * BRIK_LENGTH;
const atMiddleScenario = 2;

const bubbleBase = {
  top: scenarioHeight - BUBBLE_DIAMETER,
  left: (scenarioWidth / atMiddleScenario) - (BUBBLE_DIAMETER / 2),
  angle: 90,
};

const style = {
  width: `${scenarioWidth}px`,
  height: `${scenarioHeight}px`,
};

export default () => {
  const bubbles = computed(() => state.bubbles);
  const briks = computed(() => state.briks);

  const scene = ref(null);

  const createBubble = () => {
    const bubble = new Bubble(bubbleBase);
    state.bubbles.push(bubble);
  };

  const removeLastBubbleIfPossible = () => {
    if (state.bubbles.length > MAX_ALLOWED_BUBBLES) {
      state.bubbles.shift();
    }
  };

  const loadBriks = () => {
    loadedGame.briks.forEach((gameBrik: GameBrikInterface) => {
      state.briks.push(new Brik(gameBrik));
    });
  };

  const updateStartAngle = (event: MouseEvent) => {
    const deltaY = event.offsetY - scenarioHeight;
    const deltaX = event.offsetX - scenarioWidth / atMiddleScenario;
    const radiansToDegrees = (ANGLE_REFERENCE / Math.PI);
    const angle = Math.abs(Math.atan2(deltaY, deltaX) * radiansToDegrees);
    bubbleBase.angle = angle;
  };

  watch(() => state.cicle, (cicle) => {
    if (cicle % BUBBLE_CREATION_FACTOR === 0) {
      if (CONTINUOUS_CREATE_BUBBLES) {
        createBubble();
        removeLastBubbleIfPossible();
      } else if (state.bubbles.length < MAX_ALLOWED_BUBBLES) {
        createBubble();
      }
    }
  });

  onMounted(() => {
    console.log('mounted in the composition api!');
    loadBriks();
    createBubble();
  });

  return {
    scene,
    style,
    briks,
    bubbles,
    loadedGame,
    updateStartAngle,
  };
};
