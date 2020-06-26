import { Component, ComponentBindings, JSXComponent, Nested } from "../../../../component_declaration/common";

declare type Column = {
    name: string,
    index?: number,
}

declare type Editing = {
    editEnabled?: boolean,
}

function view(model: Widget) {
    return <div/>;
}

@ComponentBindings()
class WidgetInput { 
    @Nested() collect?: Array<Column | string>;
    @Nested() editing?: Editing;
}


@Component({
    view: view
})
export default class Widget extends JSXComponent(WidgetInput) {
    getColumns() {
        const { collect } = this.props;

        return collect?.map((el) => typeof el === 'string' ? el : el.name)
    }

    get isEditable() {
        return this.props.editing?.editEnabled;
    }
}
