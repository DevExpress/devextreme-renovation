import type { Options } from "./types.d";
import type { CustomClass } from "./types.d";
import { Input } from "@angular/core";
export class ImportProps {
  @Input() Test?: Options;
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
  selector: "dx-import",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div>{{
    viewModel.props.Test === undefined || viewModel.props.Test === null
      ? undefined
      : viewModel.props.Test.value
  }}</div>`,
})
export default class Import extends ImportProps {
  get __restAttributes(): any {
    return {};
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }
}
@NgModule({
  declarations: [Import],
  imports: [CommonModule],
  exports: [Import],
})
export class DxImportModule {}
