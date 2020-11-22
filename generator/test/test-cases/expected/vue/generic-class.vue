<script>
import Vue from "vue";
let nextEntityId = 1;

class PluginEntity {
  getValue(value) {
    return value;
  }

  constructor() {
    this.id = undefined;
    this.id = nextEntityId;
    nextEntityId += 1;
  }
}

class PluginGetter extends PluginEntity {
  getValue(value) {
    return value.reduce((base, func) => func(base), this.defaultValue);
  }

  constructor(defaultValue) {
    super();
    this.defaultValue = undefined;
    this.defaultValue = defaultValue;
  }
}
export function createValue() {
  return new PluginEntity();
}
export function createGetter(defaultValue) {
  return new PluginGetter(defaultValue);
}
export function createPlaceholder() {
  return new PluginEntity();
}
export class Plugins {
  set(entity, value) {
    this.items[entity.id] = value;
    const subscriptions = this.subscriptions[entity.id];
    if (subscriptions) {
      subscriptions.forEach((handler) => {
        handler(value);
      });
    }
  }
  extend(entity, func) {
    const value = this.items[entity.id] || [];
    this.items[entity.id] = value;
    value.push(func);
  }
  extendPlaceholder(entity, component) {
    const value = this.items[entity.id] || [];
    const newValue = [component, ...value];
    this.set(entity, newValue);
  }
  getValue(entity) {
    const value = this.items[entity.id];
    return entity.getValue(value);
  }
  watch(entity, callback) {
    const value = this.items[entity.id];
    const subscriptions = this.subscriptions[entity.id] || [];
    this.subscriptions[entity.id] = subscriptions;
    if (value !== undefined) {
      const callbackValue = entity.getValue(value);
      callback(callbackValue);
    }
    subscriptions.push(callback);
    return () => {
      const index = subscriptions.indexOf(callback);
      if (index >= 0) {
        subscriptions.splice(index, 1);
      }
    };
  }

  constructor() {
    this.items = {};
    this.subscriptions = {};
  }
}
export const PluginsContext = (value = null) => {
  return Vue.observable({
    value,
  });
};
</script>
