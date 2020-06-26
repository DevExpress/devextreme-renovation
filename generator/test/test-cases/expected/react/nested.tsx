declare type Column = { name: string, index?: number }
declare type Editing = { editEnabled?: boolean }
function view(model: Widget) {
    return <div />;
}
export declare type WidgetInputType = {
    collect?: Array<Column | string>;
    editing?: Editing;
    children?: React.ReactNode
}
const WidgetInput: WidgetInputType = {

};


import React, { useCallback } from 'react';

declare type RestProps = { className?: string; style?: React.CSSProperties;[x: string]: any }
interface Widget {
    props: typeof WidgetInput & RestProps;
    getColumns: () => any;
    isEditable: any;
    restAttributes: RestProps;
    __getNestedFromChild: (typeName: string) => { [name: string]: any }[];

}

export default function Widget(props: typeof WidgetInput & RestProps) {



    const getColumns = useCallback(function getColumns() {

        return (props.collect || __getNestedFromChild("Column"))?.map((el) => typeof el === "string" ? el : el.name);
    }, [props.collect]);
    const __isEditable = useCallback(function __isEditable() {
        return (props.editing || __getNestedFromChild("Editing")?.[0])?.editEnabled;
    }, [props.editing]);
    const __restAttributes = useCallback(function __restAttributes() {
        const { children, collect, editing, ...restProps } = {
            ...props,
            collect: (props.collect || __getNestedFromChild("Column")),
            editing: (props.editing || __getNestedFromChild("Editing")?.[0])
        }
        return restProps;
    }, [props]);
    const __getNestedFromChild = useCallback(function __getNestedFromChild(typeName: string) {
        const children = props.children, nestedComponents = React.Children.toArray(children)
            .filter(child => React.isValidElement(child) && typeof child.type !== "string" && child.type.name === typeName) as React.ReactElement[]
        return nestedComponents.map(comp => comp.props);
    }, [props.children]);

    return view(
        ({
            props: { ...props },
            getColumns,
            isEditable: __isEditable(),
            restAttributes: __restAttributes(),
            __getNestedFromChild
        })
    );
}

Widget.defaultProps = {
    ...WidgetInput
}