function view(model: Widget) {
    return <span ></span>;
}
export declare type WidgetInputType = {
    height: number;
    width: number;
}
const WidgetInput: WidgetInputType = {
    height: 10,
    width: 10
};

import * as Preact from 'preact';
import { useCallback, useImperativeHandle } from 'preact/hooks';
import { forwardRef } from 'preact/compat';

export type WidgetRef = {
    __getProps: () => any
};

interface Widget {
    props: typeof WidgetInput;
    restAttributes: any;
}

const Widget = forwardRef<WidgetRef, typeof WidgetInput>((props: typeof WidgetInput, ref) => {
    useImperativeHandle(ref, () => ({
        __getProps: () => {
            return props;
        }
    }), [props]);

    const __restAttributes=useCallback(function __restAttributes(){
        const {  height, width, ...restProps } = props;
        return restProps;
    }, [props]);
    return view(({
        props: { ...props },
        restAttributes: __restAttributes()
    })
    );
});
export default Widget;

(Widget as any).defaultProps = {
    ...WidgetInput
}
