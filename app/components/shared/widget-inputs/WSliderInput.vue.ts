import VueSlider from 'vue-slider-component';
import { throttle } from 'lodash-decorators';
import { Component, Prop } from 'vue-property-decorator';
import { WInput } from './WInput';

export interface IWSliderMetadata {
  min: number;
  max: number;
  interval?: number;
  usePercentages?: boolean;
}

@Component({
  components: { VueSlider }
})
export default class WSliderInput extends WInput<number, IWSliderMetadata>  {
  @Prop() value: number;
  @Prop() metadata: IWSliderMetadata;

  @Prop() disabled: boolean;
  @Prop() tooltip: string;
  @Prop() valueBox: boolean;
  @Prop() dotSize: number;
  @Prop() sliderStyle: object;

  usePercentages: boolean;
  interval: number;

  $refs: { slider: any };

  mounted() {

    // setup defaults
    this.interval = this.metadata.interval || 1;
    this.usePercentages = this.metadata.usePercentages || false;

    // Hack to prevent transitions from messing up slider width
    setTimeout(() => {
      if (this.$refs.slider) this.$refs.slider.refresh();
    }, 500);
  }

  @throttle(500)
  updateValue(value: number) {
    this.$emit('input', this.roundNumber(value));
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.code === 'ArrowUp') this.updateValue(this.value + this.interval);
    if (event.code === 'ArrowDown') this.updateValue(this.value - this.interval);
  }

  // Javascript precision is weird
  roundNumber(num: number) {
    return parseFloat(num.toFixed(6));
  }

  formatter(value: number) {
    let formattedValue = String(value);
    if (this.usePercentages) formattedValue = Math.round(value * 100) + '%';
    return formattedValue;
  }
}
