<script lang="ts">
import {
  Prop,
  Watch,
} from 'vue-property-decorator';
import { Vue } from 'vue-class-component';
import state from '../state';
import Brik from '../models/Brik';
import Bubble from '../models/Bubble';
import SideHits from '../interfaces/SideHits';
import { HitAngleFactor } from '../enums/HitAngleFactor';

export default class TheHit extends Vue {
  @Prop({ required: true }) briks!: Brik[];
  @Prop({ required: true }) bubbles!: Bubble[];

  get cicle() {
    return state.cicle;
  }

  @Watch('cicle')
  cicleChanged() {
    this.reviewForHits();
  }

  private reviewForHits() {
    this.briks.forEach((brik: Brik) => {
      this.bubbles.forEach((bubble: Bubble) => {
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
}
</script>
