import Base from "./empty-component.p"

import * as Preact from "preact";
import { useCallback } from "preact/hooks";

interface Widget {
    size: number;
    height: number;
    width: number;
    restAttributes: any;
}

export default function Widget(props: { 
    size: number, 
    height: number, 
    width: number 
}) {
    const __restAttributes=useCallback(function __restAttributes(){
        const { height, size, width, ...restProps } = props;
        return restProps;
    }, [props]);
    return view1(viewModel1({
        ...props,
        restAttributes: __restAttributes()
    }));
}

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
