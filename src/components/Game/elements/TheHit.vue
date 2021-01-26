<script lang="ts">
import {
  Watch,
} from 'vue-property-decorator';
import { Vue } from 'vue-class-component';
import state from '../state';
import Brik from '../models/Brik';
import Bubble from '../models/Bubble';
import SideHits from '../interfaces/SideHits';
import { HitAngleFactor } from '../enums/HitAngleFactor';
import {
  BRIK_LENGTH,
  SCENARIO_ROWS,
  ANGLE_REFERENCE,
  BUBBLE_MOVE_FACTOR,
  SCENARIO_COLUMNS,
} from '../constants';

export default class TheHit extends Vue {
  private readonly scenarioWidth = SCENARIO_COLUMNS * BRIK_LENGTH;
  private readonly scenarioHeight = SCENARIO_ROWS * BRIK_LENGTH;

  public collisionableBriks: string[] = [];
  public collisionableBubbles: string[] = [];

  get cicle() {
    return state.cicle;
  }

  get bubbles() {
    return state.bubbles;
  }

  get isTimeToBroad() {
    return this.cicle % 19 === 0;
  }

  get detectedBriks() {
    return state.briks.filter((b) => this.collisionableBriks.indexOf(b.id) > -1);
  }

  get detectedBubbles() {
    return state.bubbles.filter((b) => this.collisionableBubbles.indexOf(b.id) > -1);
  }

  @Watch('cicle')
  cicleChanged() {
    if (this.isTimeToBroad) {
      this.detectCollisionableElements();
    }
    this.reviewForBrikHits();
    this.reviewForBorderHitsAndMovement();
  }

  private detectCollisionableElements() {
    this.collisionableBriks = [];
    this.collisionableBubbles = [];
    state.bubbles.forEach((bubble: Bubble) => {
      const detectableBubbleArea = bubble.getDetectableArea();
      let foundAtLeastOneBrik = false;
      state.briks.forEach((brik: Brik) => {
        const isIntoArea = this.isBrikIntoArea(brik, detectableBubbleArea);
        if (isIntoArea) {
          foundAtLeastOneBrik = true;
          if (this.collisionableBriks.indexOf(brik.id) === -1) {
            this.collisionableBriks.push(brik.id);
          }
        }
      });
      if (foundAtLeastOneBrik) {
        this.collisionableBubbles.push(bubble.id);
      }
    });
  }

  private isBrikIntoArea(brik: Brik, bubble: Bubble) {
    const brikTop = brik.top * brik.brikLength;
    const brikLeft = brik.left * brik.brikLength;
    const brikHeight = brikTop + brik.brikLength;
    const brikWidth = brikLeft + brik.brikLength;
    const bubbleHeight = bubble.top + bubble.diameter;
    const bubbleWidth = bubble.left + bubble.diameter;

    return brikTop >= bubble.top && brikHeight <= bubbleHeight
      && brikLeft >= bubble.left && brikWidth <= bubbleWidth;
  }

  private reviewForBrikHits() {
    this.detectedBriks.forEach((brik: Brik) => {
      this.detectedBubbles.forEach((bubble: Bubble) => {
        const hitsBySide = this.getSideHits(brik, bubble);
        this.processHit(hitsBySide, bubble, brik);
      });
    });
  }

  private getSideHits(brik: Brik, bubble: Bubble) {
    const brikTop = brik.top * brik.brikLength;
    const brikLeft = brik.left * brik.brikLength;
    const brikHeight = brikTop + brik.brikLength;
    const brikWidth = brikLeft + brik.brikLength;
    const bubbleHeight = bubble.top + bubble.diameter;
    const bubbleWidth = bubble.left + bubble.diameter;

    const northLine = bubbleHeight >= brikTop && bubbleHeight < brikHeight;
    const southLine = bubble.top <= brikHeight && bubble.top > brikTop;
    const eastLine = bubble.left <= brikWidth && bubble.left > brikLeft;
    const westLine = bubbleWidth >= brikLeft && bubbleWidth < brikWidth;

    const north = northLine && eastLine && westLine;
    const south = southLine && eastLine && westLine;
    const east = eastLine && northLine && southLine;
    const west = westLine && northLine && southLine;

    return {
      north,
      south,
      east,
      west,
    };
  }

  private processHit(hitsBySide: SideHits, bubble: Bubble, brik: Brik) {
    if (this.wasAnySideHit(hitsBySide) && !bubble.isSameBrik(brik.id)) {
      bubble.setLastBrik(brik.id);
      this.changeAngleByHitSide(hitsBySide, bubble);
      brik.updateScore(-1);
      state.earnedPoints += 1;
      this.removeBrikIfPossible(brik);
    }
  }

  private wasAnySideHit(hitsBySide: SideHits) {
    return hitsBySide.north
      || hitsBySide.south
      || hitsBySide.east
      || hitsBySide.west;
  }

  private changeAngleByHitSide(hitsBySide: SideHits, bubble: Bubble) {
    if (hitsBySide.north) {
      bubble.updateAngleFactor(HitAngleFactor.SOUTH);
    }
    if (hitsBySide.south) {
      bubble.updateAngleFactor(HitAngleFactor.NORTH);
    }
    if (hitsBySide.east) {
      bubble.updateAngleFactor(HitAngleFactor.WEST);
    }
    if (hitsBySide.west) {
      bubble.updateAngleFactor(HitAngleFactor.EAST);
    }
    this.changeAngleAfterBorderHit(bubble, bubble.lastAngleFactor);
  }

  private removeBrikIfPossible(brik: Brik) {
    if (brik.score <= 0) {
      state.briks = state.briks.filter((b) => b.id !== brik.id);
      this.removeBrikFromCollisionables(brik);
    }
  }

  private removeBrikFromCollisionables(brik: Brik) {
    this.collisionableBriks = this.collisionableBriks.filter((birkId) => birkId !== brik.id);
  }

  private reviewForBorderHitsAndMovement() {
    state.bubbles.forEach((bubble: Bubble) => {
      const xMovement = BUBBLE_MOVE_FACTOR * Math.cos(bubble.angle * (Math.PI / ANGLE_REFERENCE));

      const yMovement = BUBBLE_MOVE_FACTOR * Math.sin(bubble.angle * (Math.PI / ANGLE_REFERENCE));

      bubble.moveBubble(xMovement, yMovement);
      this.hitScenarioBorder(bubble);
    });
  }

  private hitScenarioBorder(bubble: Bubble) {
    const northHit = bubble.top <= 0;
    const southHit = bubble.top > this.scenarioHeight - bubble.diameter;
    const eastHit = bubble.left <= 0;
    const westHit = bubble.left > this.scenarioWidth - bubble.diameter;
    if (northHit) {
      this.changeAngleAfterBorderHit(bubble, HitAngleFactor.NORTH);
    }
    if (southHit) {
      this.changeAngleAfterBorderHit(bubble, HitAngleFactor.SOUTH);
    }
    if (eastHit) {
      this.changeAngleAfterBorderHit(bubble, HitAngleFactor.EAST);
    }
    if (westHit) {
      this.changeAngleAfterBorderHit(bubble, HitAngleFactor.WEST);
    }

    if (northHit || southHit || eastHit || westHit) {
      this.resetBubbleLastHitBrik(bubble);
    }
  }

  private changeAngleAfterBorderHit(bubble: Bubble, angleFactor: HitAngleFactor) {
    const angleChange = angleFactor + ANGLE_REFERENCE;
    const newAngle = (angleChange + (angleFactor - bubble.angle)) % 360;
    bubble.updateAngle(newAngle);
  }

  private resetBubbleLastHitBrik(bubble: Bubble) {
    bubble.setLastBrik('');
  }
}
</script>
