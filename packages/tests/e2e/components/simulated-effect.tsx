
import {
    Component,
    ComponentBindings,
    JSXComponent,
    OneWay,
    Effect,
    InternalState,
  } from "@devextreme-generator/declarations";
  
import Button from "./button";

  function view(model: SimulatedEffect) {
    return <div>
        <Button onClick={model.onButtonClick}></Button>
        hScrollOffsetMax: {model.hScrollOffsetMax}
        location: {model.location}
    </div>;
  }
  
  @ComponentBindings()
  class Props {
    @OneWay() rtlEnabled?: number = 0;
  }
  
  @Component({
    view,
    jQuery: {register: true},
  })
  export default class SimulatedEffect extends JSXComponent(Props) {
    @InternalState() direction = {isBoth: true, isVertical: false};
    @InternalState() hScrollOffsetMax = 1;
    @InternalState() location: number = 0;
    @InternalState() fullScrollProp = '';

    onButtonClick(){
        this.hScrollOffsetMax += 5;
    }

    scrollLocationChange(eventData: {fullScrollProp: string, location: number}): void {
        const { fullScrollProp, location } = eventData;
        this.fullScrollProp = fullScrollProp;
        this.location = location;
      }

    @Effect() effectResetInactiveState(): void {
        console.log("effect triggered")
        if (this.direction.isBoth) {
          return;
        }
    
        const inactiveScrollProp = !this.direction.isVertical ? 'scrollTop' : 'scrollLeft';
    
        this.scrollLocationChange({
          fullScrollProp: inactiveScrollProp,
          location: this.props.rtlEnabled ? -this.hScrollOffsetMax : 0,
        });
    }

    @Effect() someFakeEffect(){
        if (this.hScrollOffsetMax === 1){
            this.location = 10;
        }
    }
  }
  

