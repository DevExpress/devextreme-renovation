
import react from "react";
import { Rule } from "./default_options";

export const React = react;
export const Fragment = react.Fragment;

/**
 * Class Decorator.
 * Declare class that contains all internal logic and public methods.
 * Class should extend JSXComponent<ComponentBindings>.
 * Class can contain properties with the following decorators: Ref, InternalState(optional).
 * Class can contain methods with the following decorators: Effect, Method, Listen.
 * Class can contain methods without any decorator.
 */
export function Component(arg: {
    name?: string;
    components?: any[];
     /**
     * Function that receives a component viewModel and returns a view
     */
    view: Function;

    defaultOptionRules?: Rule<any>[] | null;

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
    }
}) {
    return function ComponentDecorator(constructor: Function) {
        constructor.prototype.render = function() {
            return arg.view(this);
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
* Define a property that user can pass to component. Component can write to it.
* Any change of this property causes component re-render, also user gets notified about that change (in a different way, depending on target platform)
*/
export const TwoWay = (args?: { 
    /**
     * Specify whether to use this prop as model binding
     */
    isModel?: boolean;
}) => propertyDecorator;

/**
 * Property Decorator. 
 * Declares an input property that the user can set for custom rendering.
 * Property type should be a function that receives model and returns markup.
 */
export const Template = (args?: { 
    /**
     * Better use @Slot 
     */
    canBeAnonymous?: boolean;
}) => propertyDecorator;
/**
 * Property Decorator.
 * Declares an input property that the user can set custom rendering part of widget.
 */
export const Slot = () => propertyDecorator;
/**
 * Method Decorator. 
 * Declare A method that be available for external using
 */
export const Method = () => propertyDecorator;
/**
 * Property Decorator. 
 * Declares input property that is component event handler
 */
export const Event = (args? : {
    actionConfig?: any
}) => propertyDecorator;
/**
 * Property Decorator
 * Declares a widget property. Any change of it causes component re-render
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
export const Effect = (args?: {
    run?: 'once' | 'always'
}) => propertyDecorator;


/**
 * A function that returns base class for any Component.
 * Pass ComponentBindings as an argument
 */
export function JSXComponent<PropsType, PropsConstructor = PropsType>(Props: { new(): PropsType | PropsConstructor }) {
    return class extends React.Component<PropsType> {
        static defaultProps = new Props(); // for testing purpose
        props!: PropsType & { ref?: React.Component<PropsType> };
        restAttributes: { [name: string]: any } = { restAttributes: 'restAttributes' }; // for testing purpose
        setState() { }
    };
}

/**
 * Create Elements function
 * Import it for testing purpose
 */
export const h = react.createElement;
