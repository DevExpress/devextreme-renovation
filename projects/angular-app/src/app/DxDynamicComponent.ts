import { DxButtonComponent as DynamicComponent } from "./DxButton";
import { Input, ViewChild } from "@angular/core";
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
  template: `<div>
    <div>
      <ng-template dynamicComponent [index]="0"> </ng-template>
      <ng-template #template let-text="text">
        {{ text + "Template" }}
      </ng-template>
    </div>
  </div>`,
})
export default class DynamicComponentCreator extends Props {
  get __JSXTemplateComponent(): any {
    return DynamicComponent;
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

  @ViewChild("template", { static: true, read: TemplateRef })
  template: TemplateRef<any>;

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

      component.text = "Text";
      component.template = this.template;
      component.onClick instanceof EventEmitter
        ? component.onClick.subscribe(this.__onComponentClick.bind(this))
        : (component.onClick = this.__onComponentClick.bind(this));

      component._embeddedView = childView;
      component.changeDetection();
      this.dynamicComponents[0][index] = component;
    });
  }

  __getterCache: {
    JSXTemplateComponent?: any;
  } = {};

  ngAfterViewInit() {
    this.createJSXTemplateComponent0();
  }

  ngAfterViewChecked() {
    if (
      this.dynamicComponents[0].length !==
      this.dynamicComponentHost.toArray().filter((c) => c.index === 0).length
    ) {
      this.createJSXTemplateComponent0();
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
  imports: [CommonModule],
  entryComponents: [DynamicComponent],
  exports: [DynamicComponentCreator],
})
export class DxDynamicComponentCreatorModule {}
export { DynamicComponentCreator as DxDynamicComponentCreatorComponent };
