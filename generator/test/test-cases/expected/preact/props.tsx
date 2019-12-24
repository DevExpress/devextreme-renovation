function view() { }
function viewModel() { }

import * as Preact from "preact";

interface Component {
    height: number,
    onClick: (a: number) => null
}

export default function Component(props: { 
    height: number,
    onClick: (a:number)=>null
}) {
    function getHeight() {
        props.onClick();
        return props.height;
    }

    return view(viewModel({
        ...props
    }));
}

(Component as any).defaultProps = {
    height: 10,
    onClick: () => null
};
