import "typescript";

function view() { }

declare type WidgetProps = {}

export const WidgetProps: WidgetProps = {};

import { convertRulesToOptions, Rule } from "../../../../../../component_declaration/default_options";
import React from "react";

interface Widget { props: WidgetProps }

export default function Widget(props: WidgetProps) {
    return view(({
        props: { ...props },
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
