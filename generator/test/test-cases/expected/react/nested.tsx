declare type Column = { name: string, index?: number }
declare type Editing = { editEnabled?: boolean }
declare type Custom = {}
function view(model: Widget) {
    return <div />;
}
export const Column = () => null;
export const GridEditing = () => null;
export const SomeArray = () => null;
export declare type WidgetInputType = {
    columns?: Array<Column | string>;
    gridEditing?: Editing;
    someArray?: Array<Custom>;
    children?: React.ReactNode
}
const WidgetInput: WidgetInputType = { };

import React, { useCallback } from 'react';

declare type RestProps = { className?: string; style?: React.CSSProperties;[x: string]: any }
interface Widget {
    props: typeof WidgetInput & RestProps;
    getColumns: () => any;
    isEditable: any;
    restAttributes: RestProps;
    __getNestedFromChild: <T>(typeName: string) => T[];
}

export default function Widget(props: typeof WidgetInput & RestProps) {
    const getColumns = useCallback(function getColumns(): any {
        return (props.columns || __getNestedFromChild<Column>("Column"))?.map((el) => typeof el === "string" ? el : el.name);
    }, [props.columns, props.children]);
    const __isEditable = useCallback(function __isEditable(): any {
        return (props.gridEditing || __getNestedFromChild<Editing>("GridEditing")?.[0])?.editEnabled;
    }, [props.gridEditing, props.children]);
    const __restAttributes = useCallback(function __restAttributes(): RestProps {
        const { children, columns, gridEditing, someArray, ...restProps } = {
            ...props,
            columns: (props.columns || __getNestedFromChild<Column>("Column")),
            gridEditing: (props.gridEditing || __getNestedFromChild<Editing>("GridEditing")?.[0]),
            someArray: (props.someArray || __getNestedFromChild<Custom>("SomeArray"))
        }
        return restProps;
    }, [props]);
    const __getNestedFromChild = useCallback(function __getNestedFromChild<T>(typeName: string): T[] {
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
