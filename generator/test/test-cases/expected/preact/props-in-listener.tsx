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
import { useCallback, useImperativeHandle } from "preact/hooks";
import { forwardRef } from "preact/compat";

export type WidgetRef = {
    __getProps: () => any
};

interface Widget {
    props: typeof Props;
    clickHandler: () => any;
    restAttributes: any;
}

const Widget = forwardRef<WidgetRef, typeof Props>((props: typeof Props, ref) => {
    useImperativeHandle(ref, () => ({
        __getProps: () => {
            return props;
        }
    }), [props]);

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
});
export default Widget;

(Widget as any).defaultProps = {
    ...Props
}
