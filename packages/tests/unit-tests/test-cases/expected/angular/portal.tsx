import { Component, Input } from "@angular/core";
@Component({
  template: "",
})
export class WidgetProps {
  @Input() someRef?: HTMLElement;
}

import {
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  ElementRef,
  TemplateRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { DomPortalOutlet, DomPortal } from "@angular/cdk/portal";

@Component({
  selector: "dx-portal",
  template: `<div #content style="display:contents" *ngIf="container">
    <ng-content></ng-content>
  </div>`,
})
class DxPortal {
  @Input() container?: HTMLElement;
  @ViewChild("content") content?: ElementRef<HTMLDivElement>;
  _portal?: DomPortal;
  _outlet?: DomPortalOutlet;

  constructor(
    private _cfr: ComponentFactoryResolver,
    private _ar: ApplicationRef,
    private _injector: Injector
  ) {}

  _renderPortal() {
    if (this._portal && this._portal.isAttached) {
      this._portal.detach();
    }
    if (this.content) {
      this._portal = new DomPortal(this.content);
    }
  }

  _renderOutlet() {
    if (this._outlet) {
      this._outlet.detach();
    }
    if (this.container && document) {
      this._outlet = new DomPortalOutlet(
        this.container,
        this._cfr,
        this._ar,
        this._injector,
        document
      );
    }
  }

  _attachPortal() {
    if (this._outlet && this._portal) {
      this._outlet.attach(this._portal);
    }
  }

  ngAfterViewInit() {
    this._renderPortal();
    this._renderOutlet();
    this._attachPortal();
  }

  ngOnChanges(changes: any) {
    if (changes.container) {
      this._renderPortal();
      this._renderOutlet();
      this._attachPortal();
    }
  }

  ngOnDestroy() {
    if (this._outlet) {
      this._outlet.dispose();
    }
  }
}

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["someRef"],
  template: `<ng-template #widgetTemplate
    ><div
      ><dx-portal [container]="document.body" *ngIf="rendered"
        ><span></span
      ></dx-portal>
      <ng-container *ngIf="!rendered">{{ null }}</ng-container
      ><dx-portal [container]="someRef"><span></span></dx-portal></div
  ></ng-template>`,
})
export default class Widget extends WidgetProps {
  rendered: boolean = false;
  __onInit(): any {
    this._rendered = true;
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  __destroyEffects: any[] = [];
  __viewCheckedSubscribeEvent: Array<(() => void) | null> = [];
  _effectTimeout: any;

  ngAfterViewInit() {
    this.__destroyEffects.push(this.__onInit());
  }

  ngOnDestroy() {
    this.__destroyEffects.forEach((d) => d && d());
    clearTimeout(this._effectTimeout);
  }

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
  }
  set _rendered(rendered: boolean) {
    this.rendered = rendered;
    this._detectChanges();
  }
}
@NgModule({
  declarations: [Widget, DxPortal],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
