function view(model: Widget) {
    return <div ></div>;
}
export declare type PropsType = {
    type?: string;
    onClick?: (e: any) => void;
}
export const Props: PropsType = {

};

import * as Preact from "preact";
import { useCallback } from "preact/hooks";

interface Widget {
    props: typeof Props;
    clickHandler: () => any;
    restAttributes: any;
}

export default function Widget(props: typeof Props) {
    const clickHandler = useCallback(function clickHandler() {
        props.onClick!({ type: props.type })
    }, [props.onClick, props.type]);

    const __restAttributes = useCallback(function __restAttributes() {
        const { onClick, type, ...restProps } = props
        return restProps;
    }, [props]);

    return view(
        ({
            props: { ...props },
            clickHandler,
            restAttributes: __restAttributes()
        })
    );
}

(Widget as any).defaultProps = {
    ...Props
}
