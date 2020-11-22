import { Injectable, EventEmitter as ContextEmitter } from "@angular/core";
let nextEntityId = 1;

class PluginEntity<T, S> {
  id: number;

  constructor() {
    this.id = nextEntityId;
    nextEntityId += 1;
  }

  getValue(value: S): T {
    return (value as unknown) as T;
  }
}

class PluginGetter<T> extends PluginEntity<T, ((base: T) => T)[]> {
  private readonly defaultValue: T;

  constructor(defaultValue: T) {
    super();
    this.defaultValue = defaultValue;
  }

  getValue(value: ((base: T) => T)[]): T {
    return value.reduce((base, func) => func(base), this.defaultValue);
  }
}
export function createValue<T>(): PluginEntity<T, T> {
  return new PluginEntity<T, T>();
}
export function createGetter<T>(defaultValue: T): PluginGetter<T> {
  return new PluginGetter<T>(defaultValue);
}
export function createPlaceholder(): PluginEntity<unknown[], unknown[]> {
  return new PluginEntity<unknown[], unknown[]>();
}

export class Plugins {
  private readonly items: Record<number, unknown> = {};
  private readonly subscriptions: Record<number, Function[]> = {};
  set<T, S>(entity: PluginEntity<T, S>, value: T): void {
    this.items[entity.id] = value;
    const subscriptions = this.subscriptions[entity.id];
    if (subscriptions) {
      subscriptions.forEach((handler) => {
        handler(value);
      });
    }
  }
  extend<T>(entity: PluginGetter<T>, func: (base: T) => T): void {
    const value = (this.items[entity.id] as ((base: T) => T)[]) || [];
    this.items[entity.id] = value;
    value.push(func);
  }
  extendPlaceholder(
    entity: PluginEntity<unknown[], unknown[]>,
    component: unknown
  ): void {
    const value = (this.items[entity.id] as unknown[]) || [];
    const newValue = [component, ...value];
    this.set(entity, newValue);
  }
  getValue<T, S>(entity: PluginEntity<T, S>): T {
    const value = this.items[entity.id] as S;
    return entity.getValue(value);
  }
  watch<T, S>(
    entity: PluginEntity<T, S>,
    callback: (value: T) => void
  ): () => void {
    const value = this.items[entity.id] as S;
    const subscriptions = this.subscriptions[entity.id] || [];
    this.subscriptions[entity.id] = subscriptions;
    if (value !== undefined) {
      const callbackValue = entity.getValue(value);
      callback(callbackValue);
    }
    subscriptions.push(callback);
    return (): void => {
      const index = subscriptions.indexOf(callback);
      if (index >= 0) {
        subscriptions.splice(index, 1);
      }
    };
  }
}
@Injectable()
export class PluginsContext {
  _value: any = (null as unknown) as Plugins;
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
