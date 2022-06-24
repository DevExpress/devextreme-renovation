/**
 * @jest-environment jsdom
 */
import * as util from 'inferno-test-utils';
import React from 'react';
import { Dispatch, SetStateAction, useState } from '../hooks';
import { HookContainer } from '../container';

describe('render', () => {
  test('ensures that props is not empty', async () => {
    // eslint-disable-next-line react/require-default-props
    const Hello = ({ name }: { name?: string }) => (
      <h1>
        Hey.
        {name || 'You are awesome.'}
      </h1>
    );

    const rendered = util.renderIntoContainer(<HookContainer renderFn={Hello} />);
    const [h1] = util.scryRenderedDOMElementsWithTag(rendered, 'h1');
    expect(h1.innerHTML).toMatchInlineSnapshot('"Hey.You are awesome."');
  });

  test('renderFn without hooks work', () => {
    let updCounter: Dispatch<SetStateAction<number>> = () => { };

    const Child = (props: { prop1: number }) => <div>{props.prop1}</div>;
    const Parent = () => {
      const [counter, setCounter] = useState(0);
      updCounter = setCounter;
      return <HookContainer renderFn={Child} renderProps={{ prop1: counter }} />;
    };
    const rendered = util.renderIntoContainer(<HookContainer renderFn={Parent} />);
    const [div] = util.scryRenderedDOMElementsWithTag(rendered, 'div');
    expect(div.innerHTML).toEqual('0');
    updCounter((count) => count + 1);
    expect(div.innerHTML).toEqual('1');
  });

  test('call dispose without hooks', () => {
    const Child = (props: { prop1: number }) => <div>{props.prop1}</div>;
    const currentComponent = new HookContainer({ renderFn: Child });

    currentComponent.state = { a: 1 };
    currentComponent.dispose();

    expect(currentComponent.state).toEqual({});
  });
});
