import Props from "./component-bindings-only"
function view(model: Widget) {
    return <div >{model.props.height}</div>;
}

import { convertRulesToOptions, Rule } from "../../../../../component_declaration/default_options";
import React, { useCallback } from 'react';

interface Widget {
    props: typeof Props;
    restAttributes: any;

}

export default function Widget(props: typeof Props) {
    const __restAttributes = useCallback(function __restAttributes() {
        const { height, ...restProps } = props
        return restProps;
    }, [props]);

    return view(({
        props: { ...props },
        restAttributes: __restAttributes()
    })
    );
}

function __createDefaultProps() {
    return {
        ...Props
    }
}
Widget.defaultProps = __createDefaultProps();

type WidgetOptionRule = Rule<typeof Props>;

const __defaultOptionRules: WidgetOptionRule[] = [];
export function defaultOptions(rule: WidgetOptionRule) {
    __defaultOptionRules.push(rule);
    Widget.defaultProps = {
        ...__createDefaultProps(),
        ...convertRulesToOptions(__defaultOptionRules)
    };
}
