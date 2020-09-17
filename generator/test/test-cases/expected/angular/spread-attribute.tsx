import { Input } from "@angular/core";
export class WidgetInput {
  @Input() prop: any = {};
}

import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewRef,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div #host
    ><input #_auto_ref_0 /><input #i1 /><input #_auto_ref_1
  /></div>`,
})
export default class Widget extends WidgetInput {
  @ViewChild("host", { static: false }) host?: ElementRef<HTMLDivElement>;
  @ViewChild("i1", { static: false }) i1!: ElementRef<HTMLInputElement>;
  get __attr1(): any {
    return {};
  }
  get __attr2(): any {
    return {};
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
  @ViewChild("_auto_ref_0", { static: false }) _auto_ref_0?: ElementRef<
    HTMLDivElement
  >;
  @ViewChild("_auto_ref_1", { static: false }) _auto_ref_1?: ElementRef<
    HTMLDivElement
  >;

  scheduledApplyAttributes = false;
  __applyAttributes__() {
    const _attr_0: { [name: string]: any } = this.__attr1 || {};
    const _ref_0 = this.host?.nativeElement as any;
    if (_ref_0) {
      for (let key in _attr_0) {
        _ref_0.setAttribute(key, _attr_0[key]?.toString());
      }
    }

    const _attr_1: { [name: string]: any } = this.__attr2 || {};
    const _ref_1 = this._auto_ref_0?.nativeElement;
    if (_ref_1) {
      for (let key in _attr_1) {
        _ref_1.setAttribute(key, _attr_1[key]?.toString());
      }
    }

    const _attr_2: { [name: string]: any } = this.__attr2 || {};
    const _ref_2 = this.i1?.nativeElement as any;
    if (_ref_2) {
      for (let key in _attr_2) {
        _ref_2.setAttribute(key, _attr_2[key]?.toString());
      }
    }

    const _attr_3: { [name: string]: any } = this.prop || {};
    const _ref_3 = this._auto_ref_1?.nativeElement;
    if (_ref_3) {
      for (let key in _attr_3) {
        _ref_3.setAttribute(key, _attr_3[key]?.toString());
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
  }

  ngAfterViewChecked() {
    if (this.scheduledApplyAttributes) {
      this.__applyAttributes__();
      this.scheduledApplyAttributes = false;
    }
  }

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],
  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
