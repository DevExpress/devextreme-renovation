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
    customAttributes: () => any;
}

export default function Widget(props: WidgetInput) {
    const customAttributes=useCallback(function customAttributes(){
        const { children, namedSlot, ...restProps } = props;
        return restProps;
    }, [props]);
    return view(({
        props: { ...props },
        customAttributes
    })
    );
}

(Widget as any).defaultProps = {
    ...WidgetInput
}
