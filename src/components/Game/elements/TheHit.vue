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

export default class TheHit extends Vue {
  public collisionableBriks: Brik[] = [];
  public collisionableBubbles: Bubble[] = [];

  get cicle() {
    return state.cicle;
  }

  @Watch('cicle')
  cicleChanged() {
    this.detectCollisionableElements();
    this.reviewForHits();
  }

  private detectCollisionableElements() {
    if (this.cicle % 20 === 0) {
      this.collisionableBriks = [];
      this.collisionableBubbles = [];
      state.bubbles.forEach((bubble: Bubble) => {
        const detectableBubbleArea = bubble.getDetectableArea();
        let foundAtLeastOneBrik = false;
        state.briks.forEach((brik: Brik) => {
          const isIntoArea = this.isBrikIntoArea(brik, detectableBubbleArea);
          if (isIntoArea) {
            foundAtLeastOneBrik = true;
            if (!this.collisionableBriks.find((b) => b.id === brik.id)) {
              this.collisionableBriks.push(brik);
            }
          }
        });
        if (foundAtLeastOneBrik) {
          this.collisionableBubbles.push(bubble);
        }
      });
    }
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

  private reviewForHits() {
    this.collisionableBriks.forEach((brik: Brik) => {
      this.collisionableBubbles.forEach((bubble: Bubble) => {
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
  }

  private removeBrikIfPossible(brik: Brik) {
    if (brik.score <= 0) {
      state.briks = state.briks.filter((b) => b.id !== brik.id);
    }
  }
}
</script>
