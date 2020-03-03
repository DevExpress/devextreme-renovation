function view(viewModel: Widget) {
    return (
        <div>
            <div>
                {viewModel.props.namedSlot}
            </div>
            <div>
                {viewModel.props.children}
            </div>
        </div>
    );
}

declare type WidgetInput = {
    namedSlot?: any;
    children?: any
}
const WidgetInput: WidgetInput = {
   
};
import * as Preact from "preact";

interface Widget {
    props: WidgetInput;
}

export default function Widget(props: WidgetInput) {
    return view(({
        props: { ...props }
    })
    );
}

(Widget as any).defaultProps = {
    ...WidgetInput
}
