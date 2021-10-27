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

interface GetterType {
  stateField: string;
  propField: string;
}
import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
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
  get __someObj(): GetterType {
    if (this.__getterCache["someObj"] !== undefined) {
      return this.__getterCache["someObj"];
    }
    return (this.__getterCache["someObj"] = ((): GetterType => {
      return { stateField: this.someState, propField: this.someProp };
    })());
  }
  get __objectFromDestructured(): GetterType {
    if (this.__getterCache["objectFromDestructured"] !== undefined) {
      return this.__getterCache["objectFromDestructured"];
    }
    return (this.__getterCache["objectFromDestructured"] = ((): GetterType => {
      const { propField, stateField } = this.__someObj;
      return { stateField, propField };
    })());
  }
  __someMethod1(): any {
    const { propField, stateField: stateField2 } = this.__someObj;
  }
  __someMethodFromDestructured(): GetterType {
    const { propField, stateField } = this.__objectFromDestructured;
    return { stateField, propField };
  }
  __someMethod2(): any {
    const state = this.__someObj.stateField;
    const prop = this.__someObj.propField;
  }
  changeState(newValue: string): any {
    this._someState = newValue;
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
    someObj?: GetterType;
    objectFromDestructured?: GetterType;
  } = {};

  ngOnChanges(changes: { [name: string]: any }) {
    if (["someProp"].some((d) => changes[d])) {
      this.__getterCache["someObj"] = undefined;
    }

    if (["someProp"].some((d) => changes[d])) {
      this.__getterCache["objectFromDestructured"] = undefined;
    }
  }

  constructor(
    private changeDetection: ChangeDetectorRef,
    private render: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
  }
  set _someState(someState: string) {
    this.someState = someState;
    this._detectChanges();
    this.__getterCache["someObj"] = undefined;
    this.__getterCache["objectFromDestructured"] = undefined;
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
