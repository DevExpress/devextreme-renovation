import DynamicComponent, { WidgetInput, DxWidgetModule } from "./props";
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
  ComponentFactoryResolver,
  ViewChildren,
  EventEmitter,
  QueryList,
  Directive,
  ViewContainerRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Directive({
  selector: "[dynamicComponent]",
})
export class DynamicComponentDirective {
  @Input() index: number = 0;
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  selector: "dx-dynamic-component-creator",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div
    ><ng-template dynamicComponent [index]="0"></ng-template
    ><ng-template dynamicComponent [index]="1"></ng-template
  ></div>`,
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
  dynamicComponents: { [name: number]: any } = [];

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
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        expressions[index]
      );
      container.viewContainerRef.clear();
      const component = container.viewContainerRef.createComponent<any>(
        componentFactory
      ).instance;

      component.height instanceof EventEmitter
        ? component.height.subscribe(this.internalStateValue)
        : (component.height = this.internalStateValue);

      component.onClick instanceof EventEmitter
        ? component.onClick.subscribe(this.__onComponentClick.bind(this))
        : (component.onClick = this.__onComponentClick.bind(this));

      this.dynamicComponents[0][index] = component;
      component.changeDetection.detectChanges();
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
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        expressions[index]
      );
      container.viewContainerRef.clear();
      const component = container.viewContainerRef.createComponent<any>(
        componentFactory
      ).instance;

      component.height instanceof EventEmitter
        ? component.height.subscribe(this.height)
        : (component.height = this.height);

      component.onClick instanceof EventEmitter
        ? component.onClick.subscribe(this.__onComponentClick.bind(this))
        : (component.onClick = this.__onComponentClick.bind(this));

      this.dynamicComponents[1][index] = component;
      component.changeDetection.detectChanges();
    });
  }

  __getterCache: {
    JSXTemplateComponent?: any;
  } = {};

  ngAfterViewInit() {
    this.createJSXTemplateComponent0();
    this.createComponent1();
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
  }

  constructor(
    private changeDetection: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    super();
  }
  set _internalStateValue(internalStateValue: number) {
    this.internalStateValue = internalStateValue;
    this._detectChanges();
    this.dynamicComponents[0].forEach((component) => {
      if (component) {
        component.height instanceof EventEmitter
          ? component.height.subscribe(this.internalStateValue)
          : (component.height = this.internalStateValue);
        component.changeDetection.detectChanges();
      }
    });
  }
}
@NgModule({
  declarations: [DynamicComponentCreator, DynamicComponentDirective],
  imports: [DxWidgetModule, CommonModule],
  entryComponents: [DynamicComponent],
  exports: [DynamicComponentCreator],
})
export class DxDynamicComponentCreatorModule {}
export { DynamicComponentCreator as DxDynamicComponentCreatorComponent };
