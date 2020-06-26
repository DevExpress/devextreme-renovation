import { Component, ComponentBindings, JSXComponent, Nested } from "../../../../component_declaration/common";

declare type Column = {
    name: string,
    index?: number,
}

declare type Editing = {
    editEnabled?: boolean,
}

declare type Custom = {}

function view(model: Widget) {
    return <div/>;
}

@ComponentBindings()
class WidgetInput { 
    @Nested() columns?: Array<Column | string>;
    @Nested() gridEditing?: Editing;
    @Nested() someArray?: Array<Custom>;
}

@Component({
    view: view
})
export default class Widget extends JSXComponent(WidgetInput) {
    getColumns() {
        const { columns } = this.props;

        return columns?.map((el) => typeof el === 'string' ? el : el.name)
    }

    get isEditable() {
        return this.props.gridEditing?.editEnabled;
    }
}
