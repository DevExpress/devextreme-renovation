function view(model: Widget) {

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
import { useCallback } from 'preact/hooks';
interface Widget {
    props: WidgetInputType;
    getHeight: () => number;
    restAttributes: any;
}

export default function Widget(props: WidgetInputType) {
    const getHeight = useCallback(function getHeight() {
        props.onClick(10)
        return props.height;
    }, [props.onClick, props.height]);
    const restAttributes=useCallback(function restAttributes(){
        const {  height, onClick, ...restProps } = props;
        return restProps;
    }, [props]);
    return view(({
        props: { ...props },
        getHeight,
        restAttributes: restAttributes()
    })
    );
}

(Widget as any).defaultProps = {
    ...WidgetInput
}