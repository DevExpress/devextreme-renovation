import DynamicComponent, { DxWidgetModule } from "./props";
import { Input } from "@angular/core";
class WidgetInput {
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
  template: `<ng-template dynamicComponent [index]="0"></ng-template>`,
})
export default class DynamicComponentCreator extends WidgetInput {
  get __Component(): any {
    return DynamicComponent;
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

  @ViewChildren(DynamicComponentDirective) dynamicComponentHost!: QueryList<
    DynamicComponentDirective
  >;
  dynamicComponents: { [name: number]: any } = [];

  createComponent0() {
    const containers = this.dynamicComponentHost
      .toArray()
      .filter((c) => c.index === 0);
    this.dynamicComponents[0] = [];
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

      this.dynamicComponents[0][index] = component;
      component.changeDetection.detectChanges();
    });
  }

  ngAfterViewInit() {
    this.createComponent0();
  }

  ngAfterViewChecked() {
    if (
      this.dynamicComponents[0].length !==
      this.dynamicComponentHost.toArray().filter((c) => c.index === 0).length
    ) {
      this.createComponent0();
    }
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
