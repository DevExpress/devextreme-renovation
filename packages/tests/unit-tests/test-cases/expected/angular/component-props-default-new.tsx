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
  selector: "dx-button",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["text"],
  template: `<ng-template #widgetTemplate
    ><button>{{ text }}</button></ng-template
  >`,
})
export default class Button {
  defaultEntries: DefaultEntries;
  @Input() text?: string = "default";
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
    this.defaultEntries = [{ key: "text", value: "default" }];
  }
}
@NgModule({
  declarations: [Button],
  imports: [CommonModule],

  exports: [Button],
})
export class DxButtonModule {}
export { Button as DxButtonComponent };
