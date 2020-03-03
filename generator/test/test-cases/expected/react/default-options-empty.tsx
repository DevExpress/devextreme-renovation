function view() { }
function viewModel() { }

declare type WidgetProps = {}

export const WidgetProps: WidgetProps = {};

import { convertRulesToOptions, Rule } from "../../../../../../component_declaration/default_options";
import React from "react";

interface Widget { props: WidgetProps }

export default function Widget(props: WidgetProps) {
    return view(viewModel({
        props: { ...props },
    }));
}

function __createDefaultProps() {
    return {
        ...WidgetProps
    };
}

Widget.defaultProps = __createDefaultProps();


type WidgetOptionRule = Rule<WidgetProps>;

const __defaultOptionsRules: WidgetOptionRule[] = [];
export function defaultOptions(rule: WidgetOptionRule) {
    __defaultOptionsRules.push(rule);
    Widget.defaultProps = {
        ...__createDefaultProps(),
        ...convertRulesToOptions(__defaultOptionsRules)
    }
}
