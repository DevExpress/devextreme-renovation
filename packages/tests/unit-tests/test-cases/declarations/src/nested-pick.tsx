import { ComponentBindings, OneWay, Template, Nested } from '@devextreme-generator/declarations';
@ComponentBindings()
export class NestedProps {
  @OneWay() field1?: number;

  @Template() fieldTemplate?: () => null;

  @OneWay() field3?: number;
}

@ComponentBindings()
export class BaseProps {
  @Nested() nestedProp?: NestedProps = {};
}

export type SomeProps = BaseProps & Pick<NestedProps, 'fieldTemplate'>;