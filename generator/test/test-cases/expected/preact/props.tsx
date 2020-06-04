function view(model: Widget) {
    return <span ></span>;
}
export declare type WidgetInputType = {
    height: number;
    onClick: (a: number) => null
}
const WidgetInput: WidgetInputType = {
    height: 10,
    onClick: () => null
};

import * as Preact from 'preact';
import { useCallback, useImperativeHandle } from 'preact/hooks';
import { forwardRef } from 'preact/compat';

export type WidgetRef = {
    __getProps: () => any
};

interface Widget {
    props: typeof WidgetInput;
    getHeight: () => number;
    restAttributes: any;
}

const Widget = forwardRef<WidgetRef, typeof WidgetInput>((props: typeof WidgetInput, ref) => {
    useImperativeHandle(ref, () => ({
        __getProps: () => {
            return props;
        }
    }), [props]);

    const getHeight = useCallback(function getHeight() {
        props.onClick(10);
        const { onClick } = props;
        onClick(11);
        return props.height;
    }, [props.onClick, props.height]);

    const __restAttributes=useCallback(function __restAttributes(){
        const {  height, onClick, ...restProps } = props;
        return restProps;
    }, [props]);
    return view(({
        props: { ...props },
        getHeight,
        restAttributes: __restAttributes()
    })
    );
});
export default Widget;

(Widget as any).defaultProps = {
    ...WidgetInput
}
