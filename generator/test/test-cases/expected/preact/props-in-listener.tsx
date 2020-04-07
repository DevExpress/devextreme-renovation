function viewModel() {

}
function view() {

}

import * as Preact from 'preact';
import { useCallback } from 'preact/hooks'
interface Component {
    type?: string;
    onClick?: () => void;
    clickHandler: () => any;
    customAttributes: () => any;
}

export function Component(props: {
    type?: string,
    onClick?: () => void
}) {

    const clickHandler = useCallback(() => {
        props.onClick!({ type: props.type })
    }, [props.onClick, props.type])

    const customAttributes=useCallback(function customAttributes(){
        const { onClick, type, ...restProps } = props;
        return restProps;
    }, [props]);

    return view(viewModel({
        ...props,
        clickHandler,
        customAttributes
    })
    );
}