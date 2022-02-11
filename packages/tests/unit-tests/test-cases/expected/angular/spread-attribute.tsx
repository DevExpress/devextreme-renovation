import { Component, Input } from "@angular/core";
@Component({
  template: "",
})
export class WidgetInput {
  @Input() prop: any = {};
}

import {
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
  ElementRef,
  TemplateRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  updateUndefinedFromDefaults,
  DefaultEntries,
  UndefinedNativeElementRef,
} from "@devextreme/runtime/angular";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["prop"],
  template: `<ng-template #widgetTemplate
    ><div #hostLink
      ><input #_auto_ref_0 /><input #i1Link /><input #_auto_ref_1 /></div
  ></ng-template>`,
})
export default class Widget extends WidgetInput {
  defaultEntries: DefaultEntries;
  @ViewChild("hostLink", { static: false }) __host!: ElementRef<HTMLDivElement>;
  get host(): ElementRef<HTMLDivElement> {
    return this.__host
      ? this.__host
      : new UndefinedNativeElementRef<HTMLDivElement>();
  }
  @ViewChild("i1Link", { static: false }) __i1!: ElementRef<HTMLInputElement>;
  get i1(): ElementRef<HTMLInputElement> {
    return this.__i1
      ? this.__i1
      : new UndefinedNativeElementRef<HTMLInputElement>();
  }
  get __attr1(): any {
    return {};
  }
  get __attr2(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }
  @ViewChild("_auto_ref_0", { static: false })
  _auto_ref_0?: ElementRef<HTMLDivElement>;
  @ViewChild("_auto_ref_1", { static: false })
  _auto_ref_1?: ElementRef<HTMLDivElement>;

  scheduledApplyAttributes = false;
  __applyAttributes__() {
    const _attr_0: { [name: string]: any } = this.__attr1 || {};
    const _ref_0 = this.host?.nativeElement;
    if (_ref_0) {
      for (let key in _attr_0) {
        _ref_0.setAttribute(key, _attr_0[key].toString());
      }
    }

    const _attr_1: { [name: string]: any } = this.__attr2 || {};
    const _ref_1 = this._auto_ref_0?.nativeElement;
    if (_ref_1) {
      for (let key in _attr_1) {
        _ref_1.setAttribute(key, _attr_1[key].toString());
      }
    }

    const _attr_2: { [name: string]: any } = this.__attr2 || {};
    const _ref_2 = this.i1?.nativeElement;
    if (_ref_2) {
      for (let key in _attr_2) {
        _ref_2.setAttribute(key, _attr_2[key].toString());
      }
    }

    const _attr_3: { [name: string]: any } = this.prop || {};
    const _ref_3 = this._auto_ref_1?.nativeElement;
    if (_ref_3) {
      for (let key in _attr_3) {
        _ref_3.setAttribute(key, _attr_3[key].toString());
      }
    }
  }

  ngAfterViewInit() {
    this.__applyAttributes__();
  }
  ngOnChanges(changes: { [name: string]: any }) {
    if (["prop"].some((d) => changes[d] && !changes[d].firstChange)) {
      this.scheduledApplyAttributes = true;
    }
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );
  }

  ngAfterViewChecked() {
    if (this.scheduledApplyAttributes) {
      this.__applyAttributes__();
      this.scheduledApplyAttributes = false;
    }
  }

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    const defaultProps = new WidgetInput() as { [key: string]: any };
    this.defaultEntries = ["prop"].map((key) => ({
      key,
      value: defaultProps[key],
    }));
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
