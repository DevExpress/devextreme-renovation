import {
  GetAccessor as BaseGetAccessor,
  Identifier,
  toStringOptions,
  compileGetterCache,
} from '@devextreme-generator/core';

export class GetAccessor extends BaseGetAccessor {
  get canBeDestructured() {
    if (
      this.isEvent
      || this.isNested
      || this.isForwardRefProp
      || this.isRef
      || this.isRefProp
      || this.isForwardRef
    ) {
      return false;
    }
    return super.canBeDestructured;
  }

  toString(options?: toStringOptions): string {
    if (this.name.toString() === '__restAttributes') {
      if (options && !options.mutableOptions?.hasRestAttributes) {
        return '';
      }
    }
    if (options?.isComponent
       && this.body
       && this.isMemorized(options)) {
      const baseGetter = new BaseGetAccessor(
        this.decorators,
        this.modifiers,
        new Identifier(this.name),
        this.parameters,
        this.type,
        this.body,
      );
      if (baseGetter?.body) {
        baseGetter.body.statements = compileGetterCache(
          this._name, this.type, this.body, this.isProvider,
        );
        return baseGetter.toString(options);
      }
    }
    return super.toString(options);
  }
}
