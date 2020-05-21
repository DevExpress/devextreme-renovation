import "typescript";

function view() { }

export declare type WidgetPropsType = {}

export const WidgetProps: WidgetPropsType = {};

import { convertRulesToOptions, Rule } from "../../../../../component_declaration/default_options";
import React, {useCallback} from "react";

interface Widget { props: typeof WidgetProps, restAttributes: any; }

export default function Widget(props: typeof WidgetProps) {
    const __restAttributes=useCallback(function __restAttributes(){
        const { ...restProps } = props;
        return restProps;
    }, [props]);
    return view();
}

function __createDefaultProps() {
    return {
        ...WidgetProps,
        ...convertRulesToOptions([{ device: true, options: {} }])
    };
}

Widget.defaultProps = __createDefaultProps();


type WidgetOptionRule = Rule<typeof WidgetProps>;

const __defaultOptionRules: WidgetOptionRule[] = [];
export function defaultOptions(rule: WidgetOptionRule) {
    __defaultOptionRules.push(rule);
    Widget.defaultProps = {
        ...__createDefaultProps(),
        ...convertRulesToOptions(__defaultOptionRules)
    }
}
