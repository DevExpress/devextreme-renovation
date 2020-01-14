function view(viewModel) {
    return (
        <div>
            <div>
                {viewModel.namedSlot}
            </div>
            <div>
                {viewModel.children}
            </div>
        </div>
    );
}
function viewModel() { }

import * as Preact from "preact";

interface Component {
    namedSlot?: any,
    children?: any
}

export default function Component(props: {
    namedSlot?: any,
    children?: any
}) {
    return view(viewModel({
        ...props
    }));
}
