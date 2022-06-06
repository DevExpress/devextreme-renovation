/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/ban-types */
import * as React from 'react';
export const viewFunction = (viewModel) => (<>
      <div>a</div>
    </>);
//* Component={"name":"SimpleComponent", "jQueryRegistered":"true"}
export function SimpleComponent(props) {
    return viewFunction({ props: { ...props } });
}
// not pragma Comment
export default SimpleComponent;
