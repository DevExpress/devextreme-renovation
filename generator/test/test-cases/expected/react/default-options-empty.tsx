function view() { }
function viewModel() { }

declare type WidgetProps = {}

export const WidgetProps: WidgetProps = {};

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
