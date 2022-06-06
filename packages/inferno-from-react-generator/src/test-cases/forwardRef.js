import { useCallback } from 'react';
export const viewFunction = (viewModel) => (viewModel.props.children);
//* Component={"name":"SimpleComponent", "jQueryRegistered":"true"}
export function SimpleComponent(props) {
    const config = useCallback(() => ({ rtlEnabled: props.rtlEnabled }), [props.rtlEnabled]);
    return viewFunction({ props: { ...props }, config });
}
// not pragma Comment
export default SimpleComponent;
