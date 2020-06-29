function view() {

}
export declare type WidgetInputType = {
    size?: { width: number, height: number };
    type?: string
}
const WidgetInput: WidgetInputType = {
    size: {
        width: 10,
        height: 20
    },
    type: "type"
};

import { convertRulesToOptions, Rule } from "../../../../component_declaration/default_options";
import React, { useCallback } from 'react';

declare type RestProps = { className?: string; style?: React.CSSProperties; [x: string]: any };
interface Widget {
    props: Required<typeof WidgetInput> & RestProps;
    getHeight: number;
    type: string;
    restAttributes: RestProps;
}

export default function Widget(props: Required<typeof WidgetInput> & RestProps) {
    const __getHeight = useCallback(function __getHeight(): number {
        return props.size.height;
    }, [props.size]);
    const __type = useCallback(function __type(): string {
        const { type } = props
        return type;
    }, [props.type]);
    const __restAttributes = useCallback(function __restAttributes(): RestProps {
        const { size, type, ...restProps } = props
        return restProps;
    }, [props]);

    return view();
}

function __createDefaultProps() {
    return {
        ...WidgetInput
    }
}
Widget.defaultProps = __createDefaultProps();

type WidgetOptionRule = Rule<typeof WidgetInput>;

const __defaultOptionRules: WidgetOptionRule[] = [];
export function defaultOptions(rule: WidgetOptionRule) {
    __defaultOptionRules.push(rule);
    Widget.defaultProps = {
        ...__createDefaultProps(),
        ...convertRulesToOptions(__defaultOptionRules)
    };
}
