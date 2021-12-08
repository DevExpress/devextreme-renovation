import {
  InterfaceTemplateInput,
  ClassTemplateInput,
  TypeTemplateInput,
} from "./types.d";

interface TemplateInput {
  inputInt: number;
}

import { Injectable, Input, TemplateRef } from "@angular/core";
@Injectable()
class Props {
  @Input() PropFromClass?: ClassTemplateInput;
  @Input() PropFromInterface?: TemplateInput;
  @Input() PropFromImportedInterface?: InterfaceTemplateInput;
  @Input() PropFromImportedType?: TypeTemplateInput;
  @Input() template: TemplateRef<any> | null = null;
  @Input() template2: TemplateRef<any> | null = null;
}
import {
  Component,
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: [
    "PropFromClass",
    "PropFromInterface",
    "PropFromImportedInterface",
    "PropFromImportedType",
    "template",
    "template2",
  ],
  template: `<ng-template #widgetTemplate
    ><div
      ><ng-container
        *ngTemplateOutlet="
          template || templateDefault;
          context: {
            width: __spreadGetter.width,
            height: __spreadGetter.height
          }
        "
      >
      </ng-container
      ><ng-container
        *ngTemplateOutlet="
          template2 || template2Default;
          context: { inputInt: PropFromClass.inputInt }
        "
      >
      </ng-container
      ><ng-container
        *ngTemplateOutlet="
          template2 || template2Default;
          context: { inputInt: PropFromInterface.inputInt }
        "
      >
      </ng-container
      ><ng-container
        *ngTemplateOutlet="
          template2 || template2Default;
          context: { inputInt: PropFromImportedInterface.inputInt }
        "
      >
      </ng-container
      ><ng-container
        *ngTemplateOutlet="
          template2 || template2Default;
          context: { inputInt: PropFromImportedType.inputInt }
        "
      >
      </ng-container
    ></div>
    <ng-template #templateDefault let-width="width" let-height="height">
      <div></div>
    </ng-template>
    <ng-template #template2Default let-inputInt="inputInt">
      <div></div> </ng-template
  ></ng-template>`,
})
export default class Widget extends Props {
  get __spreadGetter(): { width: string; height: string } {
    if (this.__getterCache["spreadGetter"] !== undefined) {
      return this.__getterCache["spreadGetter"];
    }
    return (this.__getterCache["spreadGetter"] = ((): {
      width: string;
      height: string;
    } => {
      return { width: "40px", height: "30px" };
    })());
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

  __getterCache: {
    spreadGetter?: { width: string; height: string };
  } = {};

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef
  ) {
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
