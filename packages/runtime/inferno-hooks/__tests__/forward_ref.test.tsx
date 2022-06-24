/**
 * @jest-environment jsdom
 */
import * as util from 'inferno-test-utils';
import React from 'react';
import { forwardRef } from '../forward_ref';

describe('forwardRef', () => {
  it('should render wrapped component with default props', () => {
    const hooksComp = (props: { prop?: string }) => <>{props.prop}</>;
    const PublicComponent = forwardRef(hooksComp);
    PublicComponent.defaultProps = { prop: 'content' };
    const rendered = util.renderIntoContainer(<PublicComponent />);
    expect(util.renderToSnapshot(rendered)[0]).toBe('content');
  });
});
