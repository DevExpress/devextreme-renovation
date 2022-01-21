import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
  TemplateRef,
  Input,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  updateUndefinedFromDefaults,
  DefaultEntries,
} from "@devextreme/runtime/angular";

@Component({
  selector: "dx-counter",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["id"],
  template: `<ng-template #widgetTemplate
    ><button [id]="id" [onClick]="onClick">{{ value }}</button></ng-template
  >`,
})
export default class Counter {
  defaultEntries: DefaultEntries;
  @Input() id?: string = "default";
  value: number = 1;
  setValue(__val__: any): void {
    this.value = __val__;
    this._detectChanges();
  }
  onClick(): any {
    this.setValue(this.value + 1);
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

  ngOnChanges(changes: { [name: string]: any }) {
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );
  }

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
    this.defaultEntries = [{ key: "id", value: "default" }];
  }
}
@NgModule({
  declarations: [Counter],
  imports: [CommonModule],

  exports: [Counter],
})
export class DxCounterModule {}
export { Counter as DxCounterComponent };
