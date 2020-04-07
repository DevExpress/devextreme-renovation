import "typescript";

function view() { }

declare type WidgetProps = {}

export const WidgetProps: WidgetProps = {};

import { convertRulesToOptions, Rule } from "../../../../../../component_declaration/default_options";
import React, {useCallback} from "react";

interface Widget { props: WidgetProps, customAttributes:()=>any; }

export default function Widget(props: WidgetProps) {
    const customAttributes=useCallback(function customAttributes(){
        const { ...restProps } = props;
        return restProps;
    }, [props]);
    return view(({
        props: { ...props },
        customAttributes,
    }));
}

function __createDefaultProps() {
    return {
        ...WidgetProps,
        ...convertRulesToOptions([{ device: true, options: {} }])
    };
}

Widget.defaultProps = __createDefaultProps();


type WidgetOptionRule = Rule<WidgetProps>;

const __defaultOptionRules: WidgetOptionRule[] = [];
export function defaultOptions(rule: WidgetOptionRule) {
    __defaultOptionRules.push(rule);
    Widget.defaultProps = {
        ...__createDefaultProps(),
        ...convertRulesToOptions(__defaultOptionRules)
    }
}
