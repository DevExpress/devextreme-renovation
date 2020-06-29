function view(model: Widget) {
    return <div ></div>;
}
export declare type WidgetInputType = {

}
const WidgetInput: WidgetInputType = {

};


import React, { useCallback, useImperativeHandle, forwardRef } from 'react';
export type WidgetRef = { getValue: () => any }
declare type RestProps = { className?: string; style?: React.CSSProperties;[x: string]: any }
interface Widget {
    props: typeof WidgetInput & RestProps;
    restAttributes: RestProps;
}

const Widget = forwardRef<WidgetRef, typeof WidgetInput & RestProps>((props: typeof WidgetInput & RestProps, ref) => {
    useImperativeHandle(ref, () => ({
        getValue: () => {
            return 0;
        }
    }), [])
    const __restAttributes = useCallback(function __restAttributes() {
        const { ...restProps } = props
        return restProps;
    }, [props]);

    return view(
        ({
            props: { ...props },
            restAttributes: __restAttributes()
        })
    );
});

export { Widget };
export default Widget

Widget.defaultProps = {
    ...WidgetInput
}