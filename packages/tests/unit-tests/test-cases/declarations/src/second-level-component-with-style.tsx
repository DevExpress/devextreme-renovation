import {
    Component,
    JSXComponent,
    ComponentBindings,
} from "@devextreme-generator/declarations";

function view(viewModel: Widget) {
    return <tr>
        {viewModel.cells.map((height) => <td style={{ height }} />)}
    </tr>;
}

@ComponentBindings()
class WidgetInput {
}

@Component({
    view: view,
})
export default class Widget extends JSXComponent(WidgetInput) {
    get cells(): string[] {
        return [];
    }
}
