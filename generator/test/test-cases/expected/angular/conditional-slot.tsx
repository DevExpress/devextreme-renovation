import {
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from "@angular/core";
export class ButtonInput {
  @Output() onClick: EventEmitter<Event> = new EventEmitter();
  __slotChildren?: ElementRef<HTMLDivElement>;

  get children() {
    return this.__slotChildren?.nativeElement?.innerHTML.trim() || "";
  }
  @Input() id?: string;
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
  selector: "dx-button",
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ["id"],
  outputs: ["onClick"],
  template: `<div
      [id]="id"
      #host
      [ngStyle]="
        __processNgStyle({
          border: '1px solid black',
          padding: 10,
          display: 'inline-block'
        })
      "
      ><div #slotChildren style="display: contents"
        ><ng-container [ngTemplateOutlet]="children"></ng-container
      ></div>
      <ng-container *ngIf="!children">Default Text</ng-container></div
    ><ng-template #children><ng-content></ng-content></ng-template>`,
})
export default class Button extends ButtonInput {
  @ViewChild("host", { static: false }) host!: ElementRef<HTMLDivElement>;
  __clickEffect(): any {
    const handler = (e: Event) => {
      this._onClick?.(e);
    };
    this.host.nativeElement.addEventListener("click", handler);
    return () => this.host.nativeElement.removeEventListener("click", handler);
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

  __destroyEffects: any[] = [];
  __viewCheckedSubscribeEvent: Array<(() => void) | null> = [];
  _effectTimeout: any;
  __schedule_clickEffect() {
    this.__destroyEffects[0]?.();
    this.__viewCheckedSubscribeEvent[0] = () => {
      this.__destroyEffects[0] = this.__clickEffect();
    };
  }

  _updateEffects() {
    if (this.__viewCheckedSubscribeEvent.length) {
      clearTimeout(this._effectTimeout);
      this._effectTimeout = setTimeout(() => {
        this.__viewCheckedSubscribeEvent.forEach((s, i) => {
          s?.();
          if (this.__viewCheckedSubscribeEvent[i] === s) {
            this.__viewCheckedSubscribeEvent[i] = null;
          }
        });
      });
    }
  }

  ngAfterViewInit() {
    this._effectTimeout = setTimeout(() => {
      this.__destroyEffects.push(this.__clickEffect());
    }, 0);
  }
  ngOnChanges(changes: { [name: string]: any }) {
    if (
      this.__destroyEffects.length &&
      ["onClick", "host"].some((d) => changes[d])
    ) {
      this.__schedule_clickEffect();
    }
  }
  ngOnDestroy() {
    this.__destroyEffects.forEach((d) => d && d());
    clearTimeout(this._effectTimeout);
  }
  ngAfterViewChecked() {
    this._updateEffects();
  }

  _onClick: any;
  constructor(private changeDetection: ChangeDetectorRef) {
    super();
    this._onClick = (e: any) => {
      this.onClick.emit(e);
    };
  }
  @ViewChild("slotChildren") set slotChildren(
    slot: ElementRef<HTMLDivElement>
  ) {
    const oldValue = this.children;
    this.__slotChildren = slot;
    const newValue = this.children;
    if (!!oldValue !== !!newValue) {
      this._detectChanges();
    }
  }
  __processNgStyle(value: any) {
    if (typeof value === "object") {
      return Object.keys(value).reduce((v: { [name: string]: any }, k) => {
        if (typeof value[k] === "number") {
          v[k] = value[k] + "px";
        } else {
          v[k] = value[k];
        }
        return v;
      }, {});
    }

    return value;
  }
}
@NgModule({
  declarations: [Button],
  imports: [CommonModule],

  exports: [Button],
})
export class DxButtonModule {}
export { Button as DxButtonComponent };
