import { Component, Input } from '@angular/core';
@Component({
  template: '',
})
class WidgetProps {
  @Input() someProp: string = '';
  @Input() type?: string = '';
  @Input() objectProp?: { someField: number };
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
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  updateUndefinedFromDefaults,
  DefaultEntries,
} from '@devextreme/runtime/angular';

@Component({
  selector: 'dx-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['someProp', 'type', 'objectProp'],
  template: `<ng-template #widgetTemplate><div></div></ng-template>`,
})
class Widget extends WidgetProps {
  defaultEntries: DefaultEntries;

  someState: string = '';
  get __arrayFromObj(): (string | undefined)[] {
    if (this.__getterCache['arrayFromObj'] !== undefined) {
      return this.__getterCache['arrayFromObj'];
    }
    return (this.__getterCache['arrayFromObj'] = ((): (
      | string
      | undefined
    )[] => {
      const { propField, stateField } = this.__someObj;
      return [stateField, propField];
    })());
  }
  get __arrayFromArr(): (string | undefined)[] {
    if (this.__getterCache['arrayFromArr'] !== undefined) {
      return this.__getterCache['arrayFromArr'];
    }
    return (this.__getterCache['arrayFromArr'] = ((): (
      | string
      | undefined
    )[] => {
      const [stateField, propField] = this.__arrayFromObj;
      return [stateField, propField];
    })());
  }
  get __someObj(): GetterType {
    if (this.__getterCache['someObj'] !== undefined) {
      return this.__getterCache['someObj'];
    }
    return (this.__getterCache['someObj'] = ((): GetterType => {
      return { stateField: this.someState, propField: this.someProp };
    })());
  }
  get __objectFromDestructured(): GetterType {
    if (this.__getterCache['objectFromDestructured'] !== undefined) {
      return this.__getterCache['objectFromDestructured'];
    }
    return (this.__getterCache['objectFromDestructured'] = ((): GetterType => {
      const { propField, stateField } = this.__someObj;
      return { stateField, propField };
    })());
  }
  get __someGetter(): GetterType | undefined {
    if (this.__getterCache['someGetter'] !== undefined) {
      return this.__getterCache['someGetter'];
    }
    return (this.__getterCache['someGetter'] = ((): GetterType | undefined => {
      const { propField, stateField: stateField2 } = this.__someObj;
      return { stateField: stateField2, propField };
    })());
  }
  __someMethodFromDestructured(): GetterType {
    const { propField, stateField } = this.__objectFromDestructured;
    return { stateField, propField };
  }
  changeState(newValue: string): any {
    this._someState = newValue;
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  __getterCache: {
    arrayFromObj?: (string | undefined)[];
    arrayFromArr?: (string | undefined)[];
    someObj?: GetterType;
    objectFromDestructured?: GetterType;
    someGetter?: GetterType | undefined;
  } = {};

  ngOnChanges(changes: { [name: string]: any }) {
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );

    if (['someProp'].some((d) => changes[d])) {
      this.__getterCache['arrayFromObj'] = undefined;
    }

    if (['someProp'].some((d) => changes[d])) {
      this.__getterCache['arrayFromArr'] = undefined;
    }

    if (['someProp'].some((d) => changes[d])) {
      this.__getterCache['someObj'] = undefined;
    }

    if (['someProp'].some((d) => changes[d])) {
      this.__getterCache['objectFromDestructured'] = undefined;
    }

    if (['someProp'].some((d) => changes[d])) {
      this.__getterCache['someGetter'] = undefined;
    }
  }

  @ViewChild('widgetTemplate', { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    const defaultProps = new WidgetProps() as { [key: string]: any };
    this.defaultEntries = ['someProp', 'type'].map((key) => ({
      key,
      value: defaultProps[key],
    }));
  }
  set _someState(someState: string) {
    this.someState = someState;
    this._detectChanges();
    this.__getterCache['arrayFromObj'] = undefined;
    this.__getterCache['arrayFromArr'] = undefined;
    this.__getterCache['someObj'] = undefined;
    this.__getterCache['objectFromDestructured'] = undefined;
    this.__getterCache['someGetter'] = undefined;
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
