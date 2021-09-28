import { Input } from "@angular/core";
class WidgetProps {
  @Input() someProp: string = "";
  @Input() type?: string = "";
}

interface FirstGetter {
  field1: string;
  field2: number;
  field3: number;
}
import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["someProp", "type"],
  template: `<div></div>`,
})
class Widget extends WidgetProps {
  someState: string = "";
  get __someObj(): any {
    return { stateField: this.someState, propField: this.someProp };
  }
  get __objectFromDestructured(): any {
    const { propField, stateField } = this.__someObj;
    return { stateField, propField };
  }
  get __arrayFromObj(): (string | undefined)[] {
    if (this.__getterCache["arrayFromObj"] !== undefined) {
      return this.__getterCache["arrayFromObj"];
    }
    return (this.__getterCache["arrayFromObj"] = ((): (
      | string
      | undefined
    )[] => {
      const { propField, stateField } = this.__someObj;
      return [stateField, propField];
    })());
  }
  get __someObj2(): any {
    return {
      stateField: [this.someState, this.someProp],
      propField: this.__newGetter,
    };
  }
  get __arrayFromObj2(): (string | undefined)[] {
    if (this.__getterCache["arrayFromObj2"] !== undefined) {
      return this.__getterCache["arrayFromObj2"];
    }
    return (this.__getterCache["arrayFromObj2"] = ((): (
      | string
      | undefined
    )[] => {
      const { stateField } = this.__someObj2;
      return [stateField];
    })());
  }
  get __newGetter(): any {
    return this.someProps2;
  }
  get __arrayFromArr(): (string | undefined)[] {
    if (this.__getterCache["arrayFromArr"] !== undefined) {
      return this.__getterCache["arrayFromArr"];
    }
    return (this.__getterCache["arrayFromArr"] = ((): (
      | string
      | undefined
    )[] => {
      const [stateField, propField] = this.__arrayFromObj;
      return [stateField, propField];
    })());
  }
  get __someMethod(): { stateField: string; propField: string } {
    if (this.__getterCache["someMethod"] !== undefined) {
      return this.__getterCache["someMethod"];
    }
    return (this.__getterCache["someMethod"] = ((): {
      stateField: string;
      propField: string;
    } => {
      const { propField, stateField } = this.__objectFromDestructured;
      return { stateField, propField };
    })());
  }
  __someMethod2(): any {
    const state = this.__someObj.stateField;
    const prop = this.__someObj.propField;
  }
  get __someMethod3(): { stateField: string; propField: string } {
    if (this.__getterCache["someMethod3"] !== undefined) {
      return this.__getterCache["someMethod3"];
    }
    return (this.__getterCache["someMethod3"] = ((): {
      stateField: string;
      propField: string;
    } => {
      const something = this.__someObj;
      return something;
    })());
  }
  changeState(newValue: string): any {
    this._someState = newValue;
  }
  get __emptyMethod(): any {
    return "";
  }
  __getValue(): any {
    const { someProp } = this;
    return someProp;
  }
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  __getterCache: {
    arrayFromObj?: (string | undefined)[];
    arrayFromObj2?: (string | undefined)[];
    arrayFromArr?: (string | undefined)[];
    someMethod?: { stateField: string; propField: string };
    someMethod3?: { stateField: string; propField: string };
  } = {};

  ngOnChanges(changes: { [name: string]: any }) {
    if (["someProp"].some((d) => changes[d])) {
      this.__getterCache["someMethod3"] = undefined;
    }
  }

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }
  set _someState(someState: string) {
    this.someState = someState;
    this._detectChanges();
    this.__getterCache["someMethod3"] = undefined;
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
