/**
 * @jest-environment jsdom
 */

// Based on https://github.com/chrisdavies/xferno by Chris Davies

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/react-in-jsx-scope */
import * as util from 'inferno-test-utils';
import React from 'react';
import { forwardRef } from 'inferno';
import {
  useState, useEffect, useMemo, HookComponent, useContext, useImperativeHandle, useRef,
} from '../hooks';
import { createContext } from '../create_context';

function emit(eventName: string, node: any, eventArgs?: any) {
  node.$EV[eventName](eventArgs);
}

test('renders using state', async () => {
  const Hello = ({ name }: { name: string }) => {
    const [count] = useState(42);
    return (
      <h1>
        Hi
        {' '}
        {name}
        {' '}
        {count}
      </h1>
    );
  };
  const rendered = util.renderIntoContainer(<HookComponent renderFn={Hello} renderProps={{ name: 'George' }} />);
  const [h1] = util.scryRenderedDOMElementsWithTag(rendered, 'h1');
  expect(h1.innerHTML).toMatchInlineSnapshot('"Hi George 42"');
});

test('ensures that props is not empty', async () => {
  // eslint-disable-next-line react/require-default-props
  const Hello = ({ name }: { name?: string }) => (
    <h1>
      Hey.
      {name || 'You are awesome.'}
    </h1>
  );

  const rendered = util.renderIntoContainer(<HookComponent renderFn={Hello} />);
  const [h1] = util.scryRenderedDOMElementsWithTag(rendered, 'h1');
  expect(h1.innerHTML).toMatchInlineSnapshot('"Hey.You are awesome."');
});

test('multiple useStates are allowed', async () => {
  const Hello = ({ name }: { name: string }) => {
    const [count, setState] = useState<number>(42);
    const [lastName, setLastName] = useState('Cat');
    return (
      <>
        <h1 onClick={() => setState((x) => x + 1)}>
          Hi
          {' '}
          {name}
          {' '}
          {lastName}
          {' '}
          {count}
        </h1>
        <button type="button" onClick={() => setLastName(`${lastName}t`)}>add a t</button>
      </>
    );
  };

  const rendered = util.renderIntoContainer(<HookComponent renderFn={Hello} renderProps={{ name: 'George' }} />);
  const [h1] = util.scryRenderedDOMElementsWithTag(rendered, 'h1');
  const [btn] = util.scryRenderedDOMElementsWithTag(rendered, 'button');

  emit('onClick', h1);

  expect(h1.innerHTML).toMatchInlineSnapshot('"Hi George Cat 43"');

  emit('onClick', btn);

  expect(h1.innerHTML).toMatchInlineSnapshot('"Hi George Catt 43"');
});

test('effects only run once', () => {
  const fx = jest.fn();
  const Hello = () => {
    const [count, setState] = useState(0);
    useEffect(fx, []);
    return (
      <h1 onClick={() => setState(count + 1)}>
        Count is
        {' '}
        {count}
      </h1>
    );
  };

  const rendered = util.renderIntoContainer(<HookComponent renderFn={Hello} />);
  const [h1] = util.scryRenderedDOMElementsWithTag(rendered, 'h1');

  emit('onClick', h1);

  expect(fx).toHaveBeenCalledTimes(1);
  expect(h1.innerHTML).toMatchInlineSnapshot('"Count is 1"');
});

test('effects are disposed when unmounted', () => {
  const dispose = jest.fn();
  const fx = jest.fn(() => dispose);

  const Child = () => {
    useEffect(fx, []);
    return <span>Child</span>;
  };

  const Hello = () => {
    const [count, setState] = useState(0);

    return (
      <h1 onClick={() => setState(count + 1)}>
        Count is
        {' '}
        {count}
        {count < 2 && <HookComponent renderFn={Child} />}
      </h1>
    );
  };

  const rendered = util.renderIntoContainer(<HookComponent renderFn={Hello} />);
  const [h1] = util.scryRenderedDOMElementsWithTag(rendered, 'h1');

  emit('onClick', h1);

  expect(fx).toHaveBeenCalledTimes(1);
  expect(dispose).not.toHaveBeenCalled();

  emit('onClick', h1);

  expect(dispose).toHaveBeenCalledTimes(1);
});

test('use memo is only called when its watch list changes', () => {
  const fx = jest.fn((count) => `Count is ${count}`);

  const Hello = () => {
    const [count, setState] = useState(0);
    const name = useMemo(() => fx(count), [Math.floor(count / 2)]);
    return <h1 onClick={() => setState(count + 1)}>{name}</h1>;
  };

  const rendered = util.renderIntoContainer(<HookComponent renderFn={Hello} />);
  const [h1] = util.scryRenderedDOMElementsWithTag(rendered, 'h1');

  expect(h1.innerHTML).toMatchInlineSnapshot('"Count is 0"');

  emit('onClick', h1);

  expect(h1.innerHTML).toMatchInlineSnapshot('"Count is 0"');

  emit('onClick', h1);

  expect(h1.innerHTML).toMatchInlineSnapshot('"Count is 2"');

  expect(fx).toHaveBeenCalledTimes(2);
});

test('context binded to state', () => {
  interface ConfigContextValue {
    rtlEnabled?: boolean;
  }
  const ConfigContext = createContext<ConfigContextValue | undefined>(
    undefined,
  );
  const contextChildren = () => {
    const config = useContext(ConfigContext);
    return (<span id="context">{config?.rtlEnabled && 'rtlEnabled'}</span>);
  };
  const contextProvider = (props: { rtlEnabled: boolean }) => (
    <div>
      <ConfigContext.Provider value={{ rtlEnabled: props.rtlEnabled }}>
        <HookComponent renderFn={contextChildren} />
      </ConfigContext.Provider>
    </div>
  );
  const rendered = util.renderIntoContainer(
    <HookComponent renderFn={contextProvider} renderProps={{ rtlEnabled: true }} />,
  );
  const [contextChildrenValue] = util.scryRenderedDOMElementsWithTag(rendered, 'span');
  expect(contextChildrenValue.innerHTML).toBe('rtlEnabled');
});

test('useRef with method call (useImperativeHandle)', () => {
  const mockFunc = jest.fn();

  const childrenComponent = (ref: any) => (props: any) => {
    const someMethod = () => { mockFunc(); };
    useImperativeHandle(ref,
      () => ({
        someMethod,
      }), []);
    return <div />;
  };
  function ChildrenComponentHook(props: any, ref: any) {
    return (
      <HookComponent
        renderFn={
        childrenComponent(ref)
      }
        renderProps={props}
      />
    );
  }
  const ChildrenFR = forwardRef(ChildrenComponentHook);

  const parentComponent = () => {
    const childRef = useRef(null);
    return (
      <div>
        <button type="button" onClick={() => { childRef.current.someMethod(); }}>11</button>
        <ChildrenFR ref={childRef} />
      </div>
    );
  };
  const rendered = util.renderIntoContainer(<HookComponent renderFn={parentComponent} />);
  const [button] = util.scryRenderedDOMElementsWithTag(rendered, 'button');

  emit('onClick', button);
  expect(mockFunc).toHaveBeenCalledTimes(1);
});
