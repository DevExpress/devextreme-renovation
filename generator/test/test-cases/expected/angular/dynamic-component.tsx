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
  ViewChild,
  Directive,
  ViewContainerRef,
  TemplateRef,
  ComponentFactoryResolver,
} from "@angular/core";
import { CommonModule } from "@angular/common";

function updateDynamicComponent(
  component: any,
  props: { [name: string]: any }
) {
  if (component) {
    Object.keys(props).forEach((prop) => {
      const value = props[prop];
      component[prop] instanceof EventEmitter
        ? component[prop].subscribe(value)
        : (component[prop] = value);
    });
    component.changeDetection.detectChanges();
  }
}

@Directive({
  selector: "[dynamicComponent]",
})
export class DynamicComponentDirective {
  @Input() index: number = 0;

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

  createComponent(Component: any, model: any, props: { [name: string]: any }) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      Component
    );
    this.viewContainerRef.clear();
    const childView = this.renderChildView(model);
    const component = this.viewContainerRef.createComponent<any>(
      componentFactory,
      0,
      undefined,
      [childView.rootNodes]
    ).instance;
    component._embeddedView = childView;
    updateDynamicComponent(component, props);
    return component;
  }
}

@Component({
  selector: "dx-dynamic-component-creator",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div
    ><ng-template
      dynamicComponent
      [index]="0"
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
      [index]="1"
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
      [index]="2"
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
  dynamicComponents: any[][] = [];

  createJSXTemplateComponent0() {
    const containers = this.dynamicComponentHost
      .toArray()
      .filter((c) => c.index === 0);
    this.dynamicComponents[0] = [];
    if (!containers.length) {
      return;
    }

    const expression = this.__JSXTemplateComponent;
    const expressions = expression instanceof Array ? expression : [expression];

    containers.forEach((container, index) => {
      const component = container.createComponent(expressions[index], this, {
        height: this.internalStateValue,
        onClick: this.__onComponentClick.bind(this),
        ...this.__spreadProps,
      });
      this.dynamicComponents[0][index] = component;
    });
  }

  createComponent1() {
    const containers = this.dynamicComponentHost
      .toArray()
      .filter((c) => c.index === 1);
    this.dynamicComponents[1] = [];
    if (!containers.length) {
      return;
    }

    const expression = this.__Component;
    const expressions = expression instanceof Array ? expression : [expression];

    containers.forEach((container, index) => {
      const component = container.createComponent(expressions[index], this, {
        height: this.height,
        onClick: this.__onComponentClick.bind(this),
      });
      this.dynamicComponents[1][index] = component;
    });
  }

  @ViewChild("__template__generated", { static: true })
  templateRef2?: TemplateRef<any>;
  createComponentWithTemplate2() {
    const containers = this.dynamicComponentHost
      .toArray()
      .filter((c) => c.index === 2);
    this.dynamicComponents[2] = [];
    if (!containers.length) {
      return;
    }

    const expression = this.__ComponentWithTemplate;
    const expressions = expression instanceof Array ? expression : [expression];

    containers.forEach((container, index) => {
      const component = container.createComponent(expressions[index], this, {
        template: this.templateRef2,
      });
      this.dynamicComponents[2][index] = component;
    });
  }

  __getterCache: {
    JSXTemplateComponent?: any;
    ComponentWithTemplate?: any;
  } = {};

  ngAfterViewInit() {
    this.createJSXTemplateComponent0();
    this.createComponent1();
    this.createComponentWithTemplate2();
  }
  ngOnChanges(changes: { [name: string]: any }) {
    if (["height"].some((d) => changes[d] && !changes[d].firstChange)) {
      this.dynamicComponents[1].forEach((component) => {
        updateDynamicComponent(component, { height: this.height });
      });
    }
  }

  ngAfterViewChecked() {
    if (
      this.dynamicComponents[0].length !==
      this.dynamicComponentHost.toArray().filter((c) => c.index === 0).length
    ) {
      this.createJSXTemplateComponent0();
    }
    if (
      this.dynamicComponents[1].length !==
      this.dynamicComponentHost.toArray().filter((c) => c.index === 1).length
    ) {
      this.createComponent1();
    }
    if (
      this.dynamicComponents[2].length !==
      this.dynamicComponentHost.toArray().filter((c) => c.index === 2).length
    ) {
      this.createComponentWithTemplate2();
    }

    this.dynamicComponents.forEach((components) =>
      components.forEach((component: any) => {
        component._embeddedView.detectChanges();
      })
    );
  }

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }
  set _internalStateValue(internalStateValue: number) {
    this.internalStateValue = internalStateValue;
    this._detectChanges();
    this.dynamicComponents[0].forEach((component) => {
      updateDynamicComponent(component, { height: this.internalStateValue });
    });
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
