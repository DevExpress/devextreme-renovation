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
  TemplateRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Directive({
  selector: "[dynamicComponent]",
})
export class DynamicComponentDirective {
  @Input() index: number = 0;
  constructor(
    public viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {}
  renderChildView(model: any = {}) {
    const childView = this.templateRef.createEmbeddedView(model);
    childView.detectChanges();
    return childView;
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
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        expressions[index]
      );
      container.viewContainerRef.clear();
      const childView = container.renderChildView(this);
      const component = container.viewContainerRef.createComponent<any>(
        componentFactory,
        0,
        undefined,
        [childView.rootNodes]
      ).instance;

      component.key instanceof EventEmitter
        ? component.key.subscribe(index)
        : (component.key = index);

      component.onClick instanceof EventEmitter
        ? component.onClick.subscribe(this.__onComponentClick.bind(this))
        : (component.onClick = this.__onComponentClick.bind(this));

      component._embeddedView = childView;
      this.dynamicComponents[0][index] = component;
      component.changeDetection.detectChanges();
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

  constructor(
    private changeDetection: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
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
