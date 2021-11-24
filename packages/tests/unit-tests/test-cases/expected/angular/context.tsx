import {
  Injectable,
  EventEmitter as ContextEmitter,
  SkipSelf,
  Optional,
  Host,
} from "@angular/core";
@Injectable()
class P1Context {
  _value: number = 5;
  change: ContextEmitter<number> = new ContextEmitter();
  get value(): number {
    return this._value;
  }
  set value(value: number) {
    if (this._value !== value) {
      this._value = value;
      this.change.emit(value);
    }
  }
}
@Injectable()
class GetterContext {
  _value: string = "default";
  change: ContextEmitter<string> = new ContextEmitter();
  get value(): string {
    return this._value;
  }
  set value(value: string) {
    if (this._value !== value) {
      this._value = value;
      this.change.emit(value);
    }
  }
}

import { Injectable, Input } from "@angular/core";
@Injectable()
class Props {
  @Input() p1: number = 10;
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
  TemplateRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "dx-widget",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [P1Context, GetterContext],
  inputs: ["p1"],
  template: `<ng-template #widgetTemplate><span></span></ng-template>`,
})
export default class Widget extends Props {
  contextConsumerConsumer: number;
  get __sum(): any {
    return this.provider.value + this.contextConsumerConsumer;
  }
  get __contextProvider(): any {
    if (this.__getterCache["contextProvider"] !== undefined) {
      return this.__getterCache["contextProvider"];
    }
    return (this.contextProviderProvider.value = this.__getterCache[
      "contextProvider"
    ] =
      ((): any => {
        return "provide";
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
    contextProvider?: any;
  } = {};
  _destroyContext: Array<() => void> = [];

  ngOnDestroy() {
    this._destroyContext.forEach((d) => d());
  }

  ngDoCheck() {
    this.__contextProvider;
  }

  @ViewChild("widgetTemplate", { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    @SkipSelf() @Optional() private contextConsumer: P1Context,
    @Host() private provider: P1Context,
    @Host() private contextProviderProvider: GetterContext
  ) {
    super();
    if (!contextConsumer) {
      this.contextConsumer = new P1Context();
    } else {
      const changeHandler = (value: number) => {
        this.contextConsumerConsumer = value;

        this._detectChanges();
      };
      const subscription = contextConsumer.change.subscribe(changeHandler);
      this._destroyContext.push(() => {
        subscription.unsubscribe();
      });
    }
    this.contextConsumerConsumer = this.contextConsumer.value;

    this.provider.value = 10;
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
