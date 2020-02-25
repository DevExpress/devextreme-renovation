function view() { }
function viewModel() { }

declare type WidgetProps = {}

export const WidgetProps: WidgetProps = {};

import {convertRulesToOption, Rule} from "../default_options";
import React from "react";

interface Widget { props: {} }

export default function Widget(props: {

}) {
    return view(viewModel({
        props: { ...props },
    }));
}

Widget.defaultProps = {
    ...WidgetProps
};


type WidgetOptionRule = Rule<WidgetProps>;

export function defaultOptions(rule: WidgetOptionRule) { 
    Widget.defaultProps = {
        ...Widget.defaultProps,
        ...convertRulesToOption([rule])
    }
}
