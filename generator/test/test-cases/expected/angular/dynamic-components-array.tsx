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
  ViewChildren,
  EventEmitter,
  QueryList,
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
    ><ng-container *ngFor="let C of __Components; index as index"
      ><ng-template
        dynamicComponent
        [index]="0"
        let-Components="Components"
        let-restAttributes="restAttributes"
        let-height="height"
      ></ng-template></ng-container
  ></div>`,
})
export default class DynamicComponentCreator extends Props {
  get __Components(): any[] {
    if (this.__getterCache["Components"] !== undefined) {
      return this.__getterCache["Components"];
    }
    return (this.__getterCache["Components"] = ((): any[] => {
      return [DynamicComponent] as any[];
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
  dynamicComponents: any[][] = [];

  createComponents0() {
    const containers = this.dynamicComponentHost
      .toArray()
      .filter((c) => c.index === 0);
    this.dynamicComponents[0] = [];
    if (!containers.length) {
      return;
    }

    const expression = this.__Components;
    const expressions = expression instanceof Array ? expression : [expression];

    containers.forEach((container, index) => {
      const component = container.createComponent(expressions[index], this, {
        onClick: this.__onComponentClick.bind(this),
      });
      this.dynamicComponents[0][index] = component;
    });
  }

  __getterCache: {
    Components?: any[];
  } = {};

  ngAfterViewInit() {
    this.createComponents0();
  }

  ngAfterViewChecked() {
    if (
      this.dynamicComponents[0].length !==
      this.dynamicComponentHost.toArray().filter((c) => c.index === 0).length
    ) {
      this.createComponents0();
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
}
@NgModule({
  declarations: [DynamicComponentCreator, DynamicComponentDirective],
  imports: [DxWidgetModule, CommonModule],
  entryComponents: [DynamicComponent],
  exports: [DynamicComponentCreator],
})
export class DxDynamicComponentCreatorModule {}
export { DynamicComponentCreator as DxDynamicComponentCreatorComponent };
