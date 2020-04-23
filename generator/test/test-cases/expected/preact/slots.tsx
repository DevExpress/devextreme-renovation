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
    children?: any;
}
const WidgetInput: WidgetInput = {
   
};
import * as Preact from "preact";
import { useCallback } from "preact/hooks";

interface Widget {
    props: WidgetInput;
    restAttributes: any;
}

export default function Widget(props: WidgetInput) {
    const __restAttributes=useCallback(function __restAttributes(){
        const { children, namedSlot, ...restProps } = props;
        return restProps;
    }, [props]);
    return view(({
        props: { ...props },
        restAttributes: __restAttributes()
    })
    );
}

(Widget as any).defaultProps = {
    ...WidgetInput
}
