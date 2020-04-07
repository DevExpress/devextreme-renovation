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
    getRestProps: () => any;
}

export default function Widget(props: WidgetInput) {
    const getRestProps=useCallback(function getRestProps(){
        const { children, namedSlot, ...restProps } = props;
        return restProps;
    }, [props]);
    return view(({
        props: { ...props },
        getRestProps
    })
    );
}

(Widget as any).defaultProps = {
    ...WidgetInput
}
