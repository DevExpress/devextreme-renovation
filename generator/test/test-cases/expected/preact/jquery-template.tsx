declare type WidgetInput = {
    render: () => any;
    contentRender: (data: { p1: string }) => any;
}
export const WidgetInput: WidgetInput = {
    render: () => <div ></div>,
    contentRender: (data) => (<div >{data.p1}</div>)
};

import * as Preact from "preact";
import { useCallback } from "preact/hooks";
import registerComponent from "../../../../../component_declaration/jquery_component_registrator";
import Component from "../../../../../component_declaration/jquery_base_component"

interface Widget {
    props: WidgetInput;
    restAttributes: any;
}

export default function Widget(props: WidgetInput) {
    const restAttributes=useCallback(function restAttributes(){
        const { contentRender, render, ...restProps } = props;
        return restProps;
    }, [props]);
    return view(({
        props: { ...props },
        restAttributes: restAttributes()
    })
    );
}

(Widget as any).defaultProps = {
    ...WidgetInput
}

export class DxWidget extends Component {
    getProps(props:any) {
        if(props.template) {
            props.render = this._createTemplateComponent(props, 'template');
        }

        if(props.contentTemplate) {
            props.contentRender = this._createTemplateComponent(props, 'contentTemplate');
        }

        return props;
    }

    get _viewComponent() {
        return Widget;
    }
}

registerComponent('Widget', DxWidget);

function view(viewModel: Widget) {
    return (<div >
        <viewModel.props.contentRender p1={"value"} />
        <viewModel.props.render />
    </div>);
}