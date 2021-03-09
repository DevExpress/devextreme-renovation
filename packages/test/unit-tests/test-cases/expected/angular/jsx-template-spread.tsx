import {
  InterfaceTemplateInput,
  ClassTemplateInput,
  TypeTemplateInput,
} from "./types";

interface TemplateInput {
  inputInt: number;
}

import { Input, TemplateRef } from "@angular/core";
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
  ViewRef,
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
  template: `<div
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
      ><ng-container *ngTemplateOutlet="template2 || template2Default">
      </ng-container
      ><ng-container
        *ngTemplateOutlet="
          template2 || template2Default;
          context: { inputInt: PropFromInterface.inputInt }
        "
      >
      </ng-container
      ><ng-container *ngTemplateOutlet="template2 || template2Default">
      </ng-container
      ><ng-container *ngTemplateOutlet="template2 || template2Default">
      </ng-container
    ></div>
    <ng-template #templateDefault let-width="width" let-height="height">
      <div></div>
    </ng-template>
    <ng-template #template2Default let-inputInt="inputInt">
      <div></div>
    </ng-template>`,
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
