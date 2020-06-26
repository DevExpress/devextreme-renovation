function view(model: Widget) {
    return <span ></span>;
}
export declare type WidgetInputType = {
    height: number;
    width: number
}
const WidgetInput: WidgetInputType = {
    height: 10,
    width: 10
};


import * as Preact from "preact";
import { useCallback } from "preact/hooks"

declare type RestProps = { className?: string; style?: { [name: string]: any };[x: string]: any }
interface Widget {
    props: typeof WidgetInput & RestProps;
    restAttributes: RestProps;
}

export default function Widget(props: typeof WidgetInput & RestProps) {
    const __restAttributes = useCallback(function __restAttributes() {
        const { height, width, ...restProps } = props
        return restProps;
    }, [props]);

    return view(
        ({
            props: { ...props },
            restAttributes: __restAttributes()
        })
    );
}

(Widget as any).defaultProps = {
    ...WidgetInput
}