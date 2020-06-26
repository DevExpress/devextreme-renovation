declare type Column = { name: string, index?: number }
declare type GridEditing = { editEnabled?: boolean }
function view(model: Widget) {
    return <div />;
}
export declare type WidgetInputType = {
    collect?: Array<Column | string>;
    editing?: GridEditing
}
const WidgetInput: WidgetInputType = {

};


import * as Preact from "preact";
import { useCallback } from "preact/hooks"

declare type RestProps = { className?: string; style?: { [name: string]: any };[x: string]: any }
interface Widget {
    props: typeof WidgetInput & RestProps;
    getColumns: () => any;
    isEditable: any;
    restAttributes: RestProps;

}

export default function Widget(props: typeof WidgetInput & RestProps) {



    const getColumns = useCallback(function getColumns() {

        return props.collect?.map((el) => typeof el === "string" ? el : el.name);
    }, [props.collect]);
    const __isEditable = useCallback(function __isEditable() {
        return props.editing?.editEnabled;
    }, [props.editing]);
    const __restAttributes = useCallback(function __restAttributes() {
        const { collect, editing, ...restProps } = {
            collect: props.collect,
            editing: props.editing
        }
        return restProps;
    }, [props]);

    return view(
        ({
            props: { ...props },
            getColumns,
            isEditable: __isEditable(),
            restAttributes: __restAttributes()
        })
    );
}

(Widget as any).defaultProps = {
    ...WidgetInput
}