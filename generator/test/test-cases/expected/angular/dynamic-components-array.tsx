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
  EmbeddedViewRef,
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
        if (key.indexOf("dxSpreadProp") === 0) {
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

  private childView?: EmbeddedViewRef<any>;

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
      this.childView?.detectChanges();
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
    if (childView.rootNodes.length) {
      this.childView = childView;
    }

    this.createSubscriptions();
    this.updateDynamicComponent();
  }
}

@Component({
  selector: "dx-dynamic-component-creator",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div
    ><ng-container *ngFor="let C of __Components; index as index"
      ><ng-template
        dynamicComponent
        [props]="{ onClick: __onComponentClick.bind(this) }"
        [componentConstructor]="C"
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
  createDynamicComponents() {
    this.dynamicComponentHost.toArray().forEach((container) => {
      container.createComponent(this);
    });
  }

  __getterCache: {
    Components?: any[];
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
}
@NgModule({
  declarations: [DynamicComponentCreator, DynamicComponentDirective],
  imports: [DxWidgetModule, CommonModule],
  entryComponents: [DynamicComponent],
  exports: [DynamicComponentCreator],
})
export class DxDynamicComponentCreatorModule {}
export { DynamicComponentCreator as DxDynamicComponentCreatorComponent };
