import * as react from 'react';
import { createPortal } from 'react-dom';

export type DefaultsRule<T> = {
  device: any;
  options: Partial<T>;
};

export const React = react;
export const Fragment = react.Fragment;

declare type PortalProps = {
  children: react.ReactNode;
  container: Element | null | undefined;
};
export const Portal: react.ElementType<PortalProps> = ({
  children,
  container,
}) => (container instanceof Element ? createPortal(children, container) : null);

export type ComponentParameters = {
  name?: string;
  components?: any[];
  /**
   * Function that receives a component viewModel and returns a view
   */
  view: Function;

  /**
   * Set to `null` to not generate 'defaultOptions' method
   */
  defaultOptionRules?: DefaultsRule<any>[] | null;

  /**
   * Set to `true` if component is SVG-based
   */
  isSVG?: boolean;

  /**
   * jQuery wrapper specific settings
   */
  jQuery?: {
    /**
     * If jQuery widget should be registered
     */
    register?: boolean;
    /**
     * Custom base widget for wrapper
     */
    component?: any;
  };
};

/**
 * Class Decorator.
 * Declare class that contains all internal logic and public methods.
 * Class should extend JSXComponent<ComponentBindings>.
 * Class can contain properties with the following decorators: [ForwardRef](https://github.com/DevExpress/devextreme-renovation/blob/master/guidelines.md#forwardref) [Ref](https://github.com/DevExpress/devextreme-renovation/blob/master/guidelines.md#ref), InternalState(optional), Provider, Consumer (see [Context](https://github.com/DevExpress/devextreme-renovation/blob/master/guidelines.md#context)).
 * Class can contain methods with the following decorators: [Effect](https://github.com/DevExpress/devextreme-renovation/blob/master/guidelines.md#effect), [Method](https://github.com/DevExpress/devextreme-renovation/blob/master/guidelines.md#method).
 * Class can contain methods without any decorator.
 */
export function Component(arg: ComponentParameters) {
  return function ComponentDecorator(constructor: Function) {
    constructor.prototype.render = function () {
      return arg.view(this);
    };
  };
}

/**
 * Class Decorator.
 * Use for definition of Component interface.
 * Declare class that contains is everything that user of component can pass to it.
 * Class can contains only properties with decorators OneWay, TwoWay, Slot, Template.
 */
export function ComponentBindings() {
  return function ComponentBindings(_constructor: Function) {};
}

const propertyDecorator = function (_target: any, _propertyKey: string) {};

/**
 * Property Decorator.
 * Define a property that user can pass to component. Component can't write to it.
 */
export const OneWay = () => propertyDecorator;

/**
 * Property Decorator.
 * Define a property that user can pass to component.
 */
export const ForwardRef = () => propertyDecorator;
/**
 * Property Decorator.
 * Define a property that user can pass to component. Component can write to it.
 * Any change of this property causes component re-render, also user gets notified about that change (in a different way, depending on target platform)
 */
export const TwoWay = (_args?: {
  /**
   * Specify whether to use this prop as model binding
   */
  isModel?: boolean;
}) => propertyDecorator;
/**
 * Property Decorator.
 * Define a property that user can pass to component as property or as nested component.
 */
export const Nested = () => propertyDecorator;

/**
 * Property Decorator.
 * Declares an input property that the user can set for custom rendering.
 * Property type should be a function that receives model and returns markup.
 */
export const Template = () => propertyDecorator;
/**
 * Property Decorator.
 * Declares an input property that the user can set custom rendering part of widget.
 */
export const Slot = (_args?: {
  /**
   * Specify whether to pass content as svg
   */
  isSVG?: boolean;
}) => propertyDecorator;
/**
 * Method Decorator.
 * Declare A method that be available for external using
 */
export const Method = () => propertyDecorator;
/**
 * Property Decorator.
 * Declares input property that is component event handler
 */
export const Event = (_args?: { actionConfig?: any }) => propertyDecorator;
/**
 * Property Decorator
 * Declares a widget property. Any change of it causes component re-render
 */
export const InternalState = () => propertyDecorator;
/**
 * Property Decorator
 * Declares a widget property. Any change of it doesn't causes component re-render and doesn't call effects.
 */
export const Mutable = () => propertyDecorator;

class Context {}

export const Provider = (_Context: Context) => propertyDecorator;

export const Consumer = (_Context: Context) => propertyDecorator;

export const createContext = <T>(_defaultValue: T) => new Context();

export const Listen = (
  _eventName?: string,
  _parameters?: { target?: Document | Window | string },
) => propertyDecorator;
/**
 * Property Decorator.
 * Declare a reference on DOM Element
 */
export const Ref = () => propertyDecorator;

export type RefObject<T = any> = {
  bivarianceHack(instance: (T & Element) | null): void;
}['bivarianceHack'] & { current: T | null };

/**
 * Method Decorator.
 * Declare a logic that should be executed after component is rendered.
 * All DOM references is available here.
 */
export const Effect = (_args?: { run?: 'once' | 'always' }) => propertyDecorator;

interface JSXComponentBase<_P> {
  context: any;
  forceUpdate: any;
  refs: any;
  render(): any;
  setState(): any;
  state(): any;
  isReactComponent: any;
}
class JSXComponentBase<_P> {}
/**
 * A function that returns base class for any Component.
 * Pass ComponentBindings as an argument
 */
export function JSXComponent<
  PropsType,
  RequiredProps extends keyof PropsType = Exclude<
  keyof PropsType,
  keyof PropsType
  >,
>(Props?: { new (): PropsType & { ref?: React.Component<PropsType> } }) {
  type DefaultPropsType = Omit<PropsType, RequiredProps> & {
    [name: string]: any;
  };
  type RealPropsType = Partial<Omit<PropsType, RequiredProps>> &
  Pick<PropsType, RequiredProps>;
  const BaseComponent = class extends JSXComponentBase<RealPropsType> {
    static defaultProps: DefaultPropsType = ((Props && new Props())
      || {}) as DefaultPropsType;

    static isReactComponent = {};

    constructor(props: RealPropsType) {
      super();
      this.props = props as PropsType;
    }

    props!: PropsType;

    restAttributes: { [name: string]: any } = {
      'rest-attributes': 'restAttributes',
    }; // for testing purpose
  };
  BaseComponent.prototype.isReactComponent = {}; // for enzyme tests
  return BaseComponent;
}

/**
 * JSX.Element with declared properties.
 */
export type JSXTemplate<
  PropsType = {},
  RequiredProps extends keyof PropsType = Exclude<
  keyof PropsType,
  keyof PropsType
  >,
> = React.JSXElementConstructor<
Partial<Omit<PropsType, RequiredProps>> &
Required<Pick<PropsType, RequiredProps>>
>;

/**
 * Type for styles.
 */
export type CSSAttributes = React.CSSProperties;

/**
 * Create Elements function
 * Import it for testing purpose
 */
export const h = react.createElement;
