import DynamicComponent, { WidgetInput, DxWidgetModule } from "./props";
import DynamicComponentWithTemplate, {
  WidgetInput as PropsWithTemplate,
  DxWidgetWithTemplateModule,
} from "./template";
import { Input } from "@angular/core";
class Props {
  @Input() height: number = 10;
}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewRef,
  ViewChildren,
  EventEmitter,
  QueryList,
  Directive,
  ViewContainerRef,
  TemplateRef,
  ComponentFactoryResolver,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Directive({
  selector: "[dynamicComponent]",
})
export class DynamicComponentDirective {
  private _props: { [name: string]: any } = {};
  get props(): { [name: string]: any } {
    return this._props;
  }
  @Input() set props(value: { [name: string]: any }) {
    this._props = Object.keys(value).reduce(
      (result: { [name: string]: any }, key) => {
        if (key.indexOf("[spreadProp]") === 0) {
          return {
            ...result,
            ...value[key],
          };
        }
        return {
          ...result,
          [key]: value[key],
        };
      },
      {}
    );
  }
  @Input() componentConstructor: any;

  private component: any;
  private subscriptions: { [name: string]: (e: any) => void } = {};

  constructor(
    public viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  renderChildView(model: any = {}) {
    const childView = this.templateRef.createEmbeddedView(model);
    childView.detectChanges();
    return childView;
  }

  ngAfterViewChecked() {
    this.updateDynamicComponent();
  }

  updateDynamicComponent() {
    const component = this.component;
    if (component) {
      let updated = false;
      Object.keys(this.props).forEach((prop) => {
        const value = this.props[prop];
        if (component[prop] !== value) {
          if (component[prop] instanceof EventEmitter) {
            this.subscriptions[prop] = value;
          } else {
            component[prop] = value;
            updated = true;
          }
        }
      });
      updated && component.changeDetection.detectChanges();
    }
  }

  createSubscriptions() {
    const component = this.component;
    Object.keys(this.props).forEach((prop) => {
      if (component[prop] instanceof EventEmitter) {
        component[prop].subscribe((e: any) => {
          this.subscriptions[prop]?.(e);
        });
      }
    });
  }

  createComponent(model: any) {
    if (this.component) {
      return;
    }
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      this.componentConstructor
    );
    this.viewContainerRef.clear();
    const childView = this.renderChildView(model);
    const component = this.viewContainerRef.createComponent<any>(
      componentFactory,
      0,
      undefined,
      [childView.rootNodes]
    ).instance;

    this.component = component;

    this.createSubscriptions();
    this.updateDynamicComponent();
  }
}

@Component({
  selector: "dx-dynamic-component-creator",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div
    ><ng-template
      dynamicComponent
      [props]="{
        height: internalStateValue,
        onClick: __onComponentClick.bind(this),
        dxSpreadProp2: __spreadProps
      }"
      [componentConstructor]="__JSXTemplateComponent"
      let-internalStateValue="internalStateValue"
      let-Component="Component"
      let-JSXTemplateComponent="JSXTemplateComponent"
      let-ComponentWithTemplate="ComponentWithTemplate"
      let-spreadProps="spreadProps"
      let-restAttributes="restAttributes"
      let-height="height"
    ></ng-template
    ><ng-template
      dynamicComponent
      [props]="{ height: height, onClick: __onComponentClick.bind(this) }"
      [componentConstructor]="__Component"
      let-internalStateValue="internalStateValue"
      let-Component="Component"
      let-JSXTemplateComponent="JSXTemplateComponent"
      let-ComponentWithTemplate="ComponentWithTemplate"
      let-spreadProps="spreadProps"
      let-restAttributes="restAttributes"
      let-height="height"
    ></ng-template
    ><ng-template
      dynamicComponent
      [props]="{ template: __template__generated }"
      [componentConstructor]="__ComponentWithTemplate"
      let-internalStateValue="internalStateValue"
      let-Component="Component"
      let-JSXTemplateComponent="JSXTemplateComponent"
      let-ComponentWithTemplate="ComponentWithTemplate"
      let-spreadProps="spreadProps"
      let-restAttributes="restAttributes"
      let-height="height"
    ></ng-template>
    <ng-template #__template__generated let-textProp="textProp"
      ><div>{{ textProp }}</div></ng-template
    ></div
  >`,
})
export default class DynamicComponentCreator extends Props {
  internalStateValue: number = 0;
  get __Component(): typeof DynamicComponent {
    return DynamicComponent;
  }
  get __JSXTemplateComponent(): any {
    if (this.__getterCache["JSXTemplateComponent"] !== undefined) {
      return this.__getterCache["JSXTemplateComponent"];
    }
    return (this.__getterCache["JSXTemplateComponent"] = ((): any => {
      return DynamicComponent as any;
    })());
  }
  get __ComponentWithTemplate(): any {
    if (this.__getterCache["ComponentWithTemplate"] !== undefined) {
      return this.__getterCache["ComponentWithTemplate"];
    }
    return (this.__getterCache["ComponentWithTemplate"] = ((): any => {
      return DynamicComponentWithTemplate as any;
    })());
  }
  get __spreadProps(): any {
    return { export: {} };
  }
  __onComponentClick(): any {}
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  @ViewChildren(DynamicComponentDirective) dynamicComponentHost!: QueryList<
    DynamicComponentDirective
  >;
  createDynamicComponents() {
    this.dynamicComponentHost.toArray().forEach((container) => {
      container.createComponent(this);
    });
  }

  __getterCache: {
    JSXTemplateComponent?: any;
    ComponentWithTemplate?: any;
  } = {};

  ngAfterViewInit() {
    this.createDynamicComponents();
  }

  ngAfterViewChecked() {
    this.createDynamicComponents();
  }

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }
  set _internalStateValue(internalStateValue: number) {
    this.internalStateValue = internalStateValue;
    this._detectChanges();
  }
}
@NgModule({
  declarations: [DynamicComponentCreator, DynamicComponentDirective],
  imports: [DxWidgetModule, DxWidgetWithTemplateModule, CommonModule],
  entryComponents: [DynamicComponent, DynamicComponentWithTemplate],
  exports: [DynamicComponentCreator],
})
export class DxDynamicComponentCreatorModule {}
export { DynamicComponentCreator as DxDynamicComponentCreatorComponent };
