/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/ban-types */
import * as React from 'react';
import { forwardRef, useImperativeHandle } from 'react';

export const viewFunction = (): React.ReactElement => (<div />);

export type SimpleProps = {
  rtlEnabled: boolean;
  children: React.ReactNode;
};

//* Component={"name":"ForwardRef", "hasApiMethod":true}
export const ForwardRef = forwardRef(
  (_: any, ref) : React.ReactElement => {
    useImperativeHandle(
      ref,
      () => ({
        focus: () => {},
      }),
      [],
    );
    return viewFunction();
  },
);
export default ForwardRef;

ForwardRef.defaultProps = {};
