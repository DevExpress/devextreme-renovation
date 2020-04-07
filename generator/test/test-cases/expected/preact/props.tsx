function view(model: Widget) {

}
declare type WidgetInput = {
    height: number;
    onClick: (a: number) => null
}
const WidgetInput: WidgetInput = {
    height: 10,
    onClick: () => null
};

import * as Preact from 'preact';
import { useCallback } from 'preact/hooks';
interface Widget {
    props: WidgetInput;
    getHeight: () => number;
    customAttributes: () => any;
}

export default function Widget(props: WidgetInput) {
    const getHeight = useCallback(function getHeight() {
        props.onClick(10)
        return props.height;
    }, [props.onClick, props.height]);
    const customAttributes=useCallback(function customAttributes(){
        const {  height, onClick, ...restProps } = props;
        return restProps;
    }, [props]);
    return view(({
        props: { ...props },
        getHeight,
        customAttributes
    })
    );
}

(Widget as any).defaultProps = {
    ...WidgetInput
}