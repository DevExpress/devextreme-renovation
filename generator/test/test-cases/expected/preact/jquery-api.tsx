function view(viewModel: Widget) { return (<div ref={viewModel.divRef as any}></div>);}

declare type WidgetInput = {
    prop1?: number;
    prop2?: number
}
const WidgetInput: WidgetInput = { };

import * as Preact from "preact";
import { useCallback, useRef, useImperativeHandle } from "preact/hooks";
import { forwardRef } from "preact/compat";
import registerComponent from "../../../../../component_declaration/jquery_component_registrator";
import Component from "../../../../../component_declaration/jquery_base_component"

export type WidgetRef = {
    getHeight: (p:number,p1:any)=>string,
    getSize: () => string
}
interface Widget {
    props: WidgetInput;
    divRef: any;
    restAttributes: any;
}

const Widget = forwardRef<WidgetRef, WidgetInput>((props: WidgetInput, ref) => {
    const divRef = useRef<HTMLDivElement>();

    useImperativeHandle(ref, () => ({
        getHeight: (p:number=10, p1: any) => {
            return `${props.prop1} + ${props.prop2} + ${divRef.current!.innerHTML} + ${p}`;
        },
        getSize: () => {
            return `${props.prop1} + ${divRef.current!.innerHTML}`;
        }
    }), [props.prop1, props.prop2]);
    const restAttributes=useCallback(function restAttributes(){
        const { prop1, prop2, ...restProps } = props;
        return restProps;
    }, [props]);

    return view(({
        props: { ...props },
        divRef,
        restAttributes: restAttributes()
    }));
});

export default Widget;

(Widget as any).defaultProps = {
    ...WidgetInput
}

export class DxWidget extends Component {
    getHeight(p:number=10, p1: any) {
        this.viewRef.current.getHeight(p, p1);
    }

    getSize() {
        this.viewRef.current.getSize();
    }

    get _viewComponent() {
        return Widget;
    }

    _initWidget() {
        this._createViewRef();
    }
}

registerComponent('Widget', DxWidget);
