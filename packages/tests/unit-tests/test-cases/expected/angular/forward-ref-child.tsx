import { Input } from "@angular/core";
class Props {
  @Input() childRef!: (
    ref?: ElementRef<HTMLDivElement>
  ) => ElementRef<HTMLDivElement>;
  @Input() nullableRef?: (
    ref?: ElementRef<HTMLDivElement>
  ) => ElementRef<HTMLDivElement> | undefined;
  @Input() state?: number;
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
  selector: "dx-ref-on-children-child",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["childRef", "nullableRef", "state"],
  template: `<div #childRef__Ref__><div #nullableRef__Ref__></div></div>`,
})
export default class RefOnChildrenChild extends Props {
  __method(): any {
    const nullableRefHtml = this.nullableRef?.()?.nativeElement?.innerHTML;
    if (this.nullableRef) {
      this.forwardRef_nullableRef(
        new ElementRef(this.childRef()?.nativeElement)
      );
    }
    return nullableRefHtml;
  }
  get __restAttributes(): any {
    return {};
  }
  @ViewChild("childRef__Ref__", { static: false })
  childRef__Ref__!: ElementRef<HTMLDivElement>;
  @ViewChild("nullableRef__Ref__", { static: false })
  nullableRef__Ref__?: ElementRef<HTMLDivElement>;
  get forwardRef_childRef(): (
    ref?: ElementRef<HTMLDivElement>
  ) => ElementRef<HTMLDivElement> {
    if (this.__getterCache["forwardRef_childRef"] !== undefined) {
      return this.__getterCache["forwardRef_childRef"];
    }
    return (this.__getterCache["forwardRef_childRef"] = ((): ((
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement>) => {
      return function (
        this: RefOnChildrenChild,
        ref?: ElementRef<HTMLDivElement>
      ): ElementRef<HTMLDivElement> {
        if (arguments.length) {
          this.childRef__Ref__ = ref!;
          this.childRef(ref);
        }
        return this.childRef();
      }.bind(this);
    })());
  }
  get forwardRef_nullableRef(): (
    ref?: ElementRef<HTMLDivElement>
  ) => ElementRef<HTMLDivElement> | undefined {
    if (this.__getterCache["forwardRef_nullableRef"] !== undefined) {
      return this.__getterCache["forwardRef_nullableRef"];
    }
    return (this.__getterCache["forwardRef_nullableRef"] = ((): ((
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement> | undefined) => {
      return function (
        this: RefOnChildrenChild,
        ref?: ElementRef<HTMLDivElement>
      ): ElementRef<HTMLDivElement> | undefined {
        if (arguments.length) {
          this.nullableRef__Ref__ = ref;
          this.nullableRef?.(ref);
        }
        return this.nullableRef?.();
      }.bind(this);
    })());
  }
  _detectChanges(): void {
    setTimeout(() => {
      if (this.changeDetection && !(this.changeDetection as ViewRef).destroyed)
        this.changeDetection.detectChanges();
    });
  }

  __getterCache: {
    forwardRef_childRef?: (
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement>;
    forwardRef_nullableRef?: (
      ref?: ElementRef<HTMLDivElement>
    ) => ElementRef<HTMLDivElement> | undefined;
  } = {};

  ngAfterViewInit() {
    this.childRef(this.childRef__Ref__);

    this.nullableRef?.(this.nullableRef__Ref__);
  }

  constructor(private changeDetection: ChangeDetectorRef) {
    super();
  }
}
@NgModule({
  declarations: [RefOnChildrenChild],
  imports: [CommonModule],

  exports: [RefOnChildrenChild],
})
export class DxRefOnChildrenChildModule {}
export { RefOnChildrenChild as DxRefOnChildrenChildComponent };
