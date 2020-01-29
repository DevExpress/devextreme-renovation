
import react from "react";

export const React = react;

export function Component(args: {
    name?: string;
    components?: any[];
    viewModel: Function;
    view: Function;
}) {
    return function ComponentDecorator(constructor: Function) {
        constructor.prototype.render = function() {
            return args.view(args.viewModel(this));
        };
    }
}

export function ComponentInput() { 
    return function ComponentInput(constructor: Function) { }
}

const propertyDecorator = function(target: any, propertyKey: string) { };

export const Prop = () => propertyDecorator;
export const Template = () => propertyDecorator;
export const Slot = () => propertyDecorator;
export const Method = () => propertyDecorator;
export const Event = () => propertyDecorator;
export const State = () => propertyDecorator;
export const Listen = (eventName?: string, parameters?: { target?: Document | Window | string }) => propertyDecorator;
export const Ref = () => propertyDecorator;
export const Effect = () => propertyDecorator;


export class JSXComponent<T> extends React.Component<T> {
    props!: T;
    setState() {}
};
