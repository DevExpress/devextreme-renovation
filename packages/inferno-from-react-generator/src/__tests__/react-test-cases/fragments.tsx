/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/ban-types */
import * as React from 'react';

export const viewFunction = (viewModel: {
  props: Props }): React.ReactNode => (
    <>
      <div>a</div>
    </>
);

export type Props = {};

//* Component={"name":"SimpleComponent" }
function SimpleComponent(props: Props): React.ReactNode {
  return viewFunction({ props: { ...props } });
}
// not pragma Comment

export { SimpleComponent };
