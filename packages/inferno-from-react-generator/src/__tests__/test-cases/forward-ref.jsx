/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/ban-types */
import * as React from 'react';
import { forwardRef, useImperativeHandle } from 'react';
export const viewFunction = () => (<div />);
//* Component={"name":"ForwardRef", "hasApiMethod":true}
const ForwardRef = forwardRef((_, ref) => {
    useImperativeHandle(ref, () => ({
        focus: () => { },
    }), []);
    return viewFunction();
});
export { ForwardRef };
export default ForwardRef;
ForwardRef.defaultProps = {};
