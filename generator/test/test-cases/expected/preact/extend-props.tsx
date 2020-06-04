import Base from "./empty-component.p"

import * as Preact from "preact";
import { useCallback, useImperativeHandle } from "preact/hooks";
import { forwardRef } from "preact/compat";

export type WidgetRef = {
    __getProps: () => any
};

interface Widget {
    size: number;
    height: number;
    width: number;
    restAttributes: any;
}

const Widget = forwardRef<WidgetRef, { 
    size: number, 
    height: number, 
    width: number }>((props: {
    size: number,
    height: number,
    width: number
}, ref) => {
    useImperativeHandle(ref, () => ({
        __getProps: () => {
            return props;
        }
    }), [props]);

    const __restAttributes=useCallback(function __restAttributes(){
        const { height, size, width, ...restProps } = props;
        return restProps;
    }, [props]);
    return view1(viewModel1({
        ...props,
        restAttributes: __restAttributes()
    }));
});
export default Widget;

function viewModel1(model: Widget) {
    return {
        height: model.height
    }
}

function view1(viewModel: Widget) {
    return <div style={{ height: viewModel.height }}>
        <span></span>
        <span></span>
        <Base height={viewModel.height}></Base>
    </div>
}
