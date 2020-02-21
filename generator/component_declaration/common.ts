
import react from "react";
import { Rule } from "./default_options";

export const React = react;
export const Fragment = react.Fragment;

/**
 * Class Decorator.
 * Declare class that contains all internal logic and public methods.
 * Class should extend JSXComponent<ComponentBindings>.
 * Class can contains properties with the following decorators: Ref, InternalState(optional).
 * Class can contains method with the following decorators: Effect, Method, Listen.
 * Class can contains methods without any decorator.
 */
export function Component(args: {
    name?: string;
    components?: any[];
    /**
     * Function that recieves a component model and returns a viewModel
     */
    viewModel: Function;
     /**
     * Function that recieves a component viewModel and returns a view
     */
    view: Function;

    defaultOptionsRules?: Rule<any>[];
}) {
    return function ComponentDecorator(constructor: Function) {
        constructor.prototype.render = function() {
            return args.view(args.viewModel(this));
        };
    }
}

/**
 * Class Decorator.
 * Use for definition of Component interface.
 * Declare class that contains is everything that user of component can pass to it.
 * Class can contains only properties with decorators OneWay, TwoWay, Slot, Template.
 */
export function ComponentBindings() { 
    return function ComponentBindings(constructor: Function) { }
}

const propertyDecorator = function(target: any, propertyKey: string) { };

/**
 * Property Decorator.
 * Define a property that user can pass to component. Component can't write to it.
 */
export const OneWay = () => propertyDecorator;
/**
* Property Decorator.
* Define a property that user can pass to component. Componet can write to it.
* Any change of this property causes component re-render, also user gets notified about that change (in a different way, depending on target platform)
*/
export const TwoWay = () => propertyDecorator;

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
export const Slot = () => propertyDecorator;
/**
 * Method Decorator. 
 * Declare A method that be available for extenal using
 */
export const Method = () => propertyDecorator;
/**
 * Property Decorator. 
 * Delcares input property that is component event handler
 */
export const Event = () => propertyDecorator;
/**
 * Property Decorator
 * Declares a widget propety. Any change of it causes component rerender
 */
export const InternalState = () => propertyDecorator;

export const Listen = (eventName?: string, parameters?: { target?: Document | Window | string }) => propertyDecorator;
/**
 * Property Decorator. 
 * Declare a reference on DOM Element
 */
export const Ref = () => propertyDecorator;
/**
 * Method Decorator.
 * Declare a logic that should be executed after component is rendered. 
 * All DOM references is available here.
 */
export const Effect = () => propertyDecorator;

/**
 * Base Class for any Component. 
 * Pass ComponentBindings as type argument 
 */
export class JSXComponent<T> extends React.Component<T> {
    props!: T;
    setState() {}
};
