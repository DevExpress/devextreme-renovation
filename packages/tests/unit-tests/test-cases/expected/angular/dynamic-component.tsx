import DynamicComponent, { DxWidgetModule } from './props';
import DynamicComponentWithTemplate, {
  DxWidgetWithTemplateModule,
} from './template';
import { Component, Input } from '@angular/core';
@Component({
  template: '',
})
class Props {
  @Input() height: number = 10;
}

import {
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChildren,
  EventEmitter,
  QueryList,
  Directive,
  TemplateRef,
  ComponentFactoryResolver,
  EmbeddedViewRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  updateUndefinedFromDefaults,
  DefaultEntries,
} from '@devextreme/runtime/angular';
import { normalizeStyles } from '@devextreme/runtime/common';

@Directive({
  selector: '[dynamicComponent]',
})
export class DynamicComponentDirective {
  private _props: { [name: string]: any } = {};
  get props(): { [name: string]: any } {
    return this._props;
  }
  @Input() set props(value: { [name: string]: any }) {
    this._props = Object.keys(value).reduce(
      (result: { [name: string]: any }, key) => {
        if (key.indexOf('dxSpreadProp') === 0) {
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
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
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
  selector: 'dx-dynamic-component-creator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['height'],
  template: `<ng-template #widgetTemplate
    ><div
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
        [props]="{ template: __template__generated1 }"
        [componentConstructor]="__ComponentWithTemplate"
        let-internalStateValue="internalStateValue"
        let-Component="Component"
        let-JSXTemplateComponent="JSXTemplateComponent"
        let-ComponentWithTemplate="ComponentWithTemplate"
        let-spreadProps="spreadProps"
        let-restAttributes="restAttributes"
        let-height="height"
      ></ng-template>
      <ng-template #__template__generated1 let-textProp="textProp"
        ><div [ngStyle]="__processNgStyle({ height: '50px' })">{{
          textProp
        }}</div></ng-template
      ></div
    ></ng-template
  >`,
})
export default class DynamicComponentCreator extends Props {
  defaultEntries: DefaultEntries;

  internalStateValue: number = 0;
  get __Component(): typeof DynamicComponent {
    return DynamicComponent;
  }
  get __JSXTemplateComponent(): any {
    return DynamicComponent as any;
  }
  get __ComponentWithTemplate(): any {
    return DynamicComponentWithTemplate as any;
  }
  get __spreadProps(): any {
    return { export: {} };
  }
  __onComponentClick(): any {}
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  @ViewChildren(DynamicComponentDirective)
  dynamicComponentHost!: QueryList<DynamicComponentDirective>;
  createDynamicComponents() {
    this.dynamicComponentHost.toArray().forEach((container) => {
      container.createComponent(this);
    });
  }

  ngAfterViewInit() {
    this.createDynamicComponents();
  }
  ngOnChanges(changes: { [name: string]: any }) {
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );
  }

  ngAfterViewChecked() {
    this.createDynamicComponents();
  }

  @ViewChild('widgetTemplate', { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    const defaultProps = new Props() as { [key: string]: any };
    this.defaultEntries = ['height'].map((key) => ({
      key,
      value: defaultProps[key],
    }));
  }
  set _internalStateValue(internalStateValue: number) {
    this.internalStateValue = internalStateValue;
    this._detectChanges();
  }
  __processNgStyle(value: any) {
    return normalizeStyles(value);
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
