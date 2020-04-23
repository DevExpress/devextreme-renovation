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

export declare type WidgetInputType = {
    namedSlot?: any;
    children?: any;
}
const WidgetInput: WidgetInputType = {
   
};
import * as Preact from "preact";
import { useCallback } from "preact/hooks";

interface Widget {
    props: WidgetInputType;
    restAttributes: any;
}

export default function Widget(props: WidgetInputType) {
    const restAttributes=useCallback(function restAttributes(){
        const { children, namedSlot, ...restProps } = props;
        return restProps;
    }, [props]);
    return view(({
        props: { ...props },
        restAttributes: restAttributes()
    })
    );
}

(Widget as any).defaultProps = {
    ...WidgetInput
}
