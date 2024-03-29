import {
  Injectable,
  EventEmitter as ContextEmitter,
  SkipSelf,
  Optional,
  Host,
} from '@angular/core';
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
class ContextForConsumer {
  _value: any = null;
  change: ContextEmitter<any> = new ContextEmitter();
  get value(): any {
    return this._value;
  }
  set value(value: any) {
    if (this._value !== value) {
      this._value = value;
      this.change.emit(value);
    }
  }
}
@Injectable()
class GetterContext {
  _value: string = 'default';
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

import { Component, Input } from '@angular/core';
@Component({
  template: '',
})
class Props {
  @Input() p1: number = 10;
}

import {
  NgModule,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewContainerRef,
  Renderer2,
  ViewRef,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  updateUndefinedFromDefaults,
  DefaultEntries,
} from '@devextreme/runtime/angular';

@Component({
  selector: 'dx-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [P1Context, GetterContext],
  inputs: ['p1'],
  template: `<ng-template #widgetTemplate><span></span></ng-template>`,
})
export default class Widget extends Props {
  defaultEntries: DefaultEntries;

  contextConsumerConsumer: number;
  consumerConsumer: any;
  get __sum(): any {
    return this.provider.value + this.contextConsumerConsumer;
  }
  get __contextProvider(): any {
    if (this.__getterCache['contextProvider'] !== undefined) {
      return this.__getterCache['contextProvider'];
    }
    return (this.contextProviderProvider.value = this.__getterCache[
      'contextProvider'
    ] =
      ((): any => {
        return 'provide';
      })());
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

  ngOnChanges(changes: { [name: string]: any }) {
    updateUndefinedFromDefaults(
      this as Record<string, unknown>,
      changes,
      this.defaultEntries
    );
  }
  ngOnDestroy() {
    this._destroyContext.forEach((d) => d());
  }

  ngDoCheck() {
    this.__contextProvider;
  }

  @ViewChild('widgetTemplate', { static: true })
  widgetTemplate!: TemplateRef<any>;
  constructor(
    private changeDetection: ChangeDetectorRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    @SkipSelf() @Optional() private contextConsumer: P1Context,
    @Host() private provider: P1Context,
    @SkipSelf() @Optional() private consumer: ContextForConsumer,
    @Host() private contextProviderProvider: GetterContext
  ) {
    super();
    const defaultProps = new Props() as { [key: string]: any };
    this.defaultEntries = ['p1'].map((key) => ({
      key,
      value: defaultProps[key],
    }));
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
    if (!consumer) {
      this.consumer = new ContextForConsumer();
    } else {
      const changeHandler = (value: any) => {
        this.consumerConsumer = value;

        this._detectChanges();
      };
      const subscription = consumer.change.subscribe(changeHandler);
      this._destroyContext.push(() => {
        subscription.unsubscribe();
      });
    }
    this.consumerConsumer = this.consumer.value;
  }
}
@NgModule({
  declarations: [Widget],
  imports: [CommonModule],

  exports: [Widget],
})
export class DxWidgetModule {}
export { Widget as DxWidgetComponent };
