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
import { rerender } from 'inferno';
import {
  useState,
  useEffect,
  useMemo,
  HookContainer,
  useContext,
  useImperativeHandle,
  useRef,
  forwardRef,
  useCallback,
  Dispatch,
  SetStateAction,
} from '../hooks';
import { createContext } from '../create_context';

function emit(eventName: string, node: any, eventArgs?: any) {
  node.$EV[eventName](eventArgs);
}

describe('Hooks', () => {
  describe('useState', () => {
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
      const rendered = util.renderIntoContainer(<HookContainer renderFn={Hello} renderProps={{ name: 'George' }} />);
      const [h1] = util.scryRenderedDOMElementsWithTag(rendered, 'h1');
      expect(h1.innerHTML).toMatchInlineSnapshot('"Hi George 42"');
    });

    test('multiple useStates are allowed', async () => {
      let updCounter: Dispatch<SetStateAction<number>> = () => {};
      let updLastName: Dispatch<SetStateAction<string>> = () => {};
      const Hello = ({ name }: { name: string }) => {
        const [counter, setCounter] = useState<number>(42);
        updCounter = setCounter;
        const [lastName, setLastName] = useState('Cat');
        updLastName = setLastName;

        return (
          <>
            <h1>
              Hi
              {' '}
              {name}
              {' '}
              {lastName}
              {' '}
              {counter}
            </h1>
          </>
        );
      };

      const rendered = util.renderIntoContainer(<HookContainer renderFn={Hello} renderProps={{ name: 'George' }} />);
      const [h1] = util.scryRenderedDOMElementsWithTag(rendered, 'h1');

      updCounter((x) => x + 1);

      expect(h1.innerHTML).toMatchInlineSnapshot('"Hi George Cat 43"');

      updLastName((name) => `${name}t`);

      expect(h1.innerHTML).toMatchInlineSnapshot('"Hi George Catt 43"');
    });
  });

  describe('useEffect', () => {
    test('effects only run once with empty dep array', () => {
      const fx = jest.fn();
      let updCounter: Dispatch<SetStateAction<number>> = () => {};

      const Hello = () => {
        const [count, setCounter] = useState(0);
        useEffect(fx, []);
        updCounter = setCounter;
        return (
          <h1 onClick={() => setCounter(count + 1)}>
            Count is
            {' '}
            {count}
          </h1>
        );
      };

      const rendered = util.renderIntoContainer(<HookContainer renderFn={Hello} />);
      const [h1] = util.scryRenderedDOMElementsWithTag(rendered, 'h1');

      updCounter((count) => count + 1);

      expect(fx).toHaveBeenCalledTimes(1);
      expect(h1.innerHTML).toMatchInlineSnapshot('"Count is 1"');
    });

    test('effects are disposed when unmounted', () => {
      const dispose = jest.fn();
      const fx = jest.fn(() => dispose);
      let updCounter: Dispatch<SetStateAction<number>> = () => {};

      const Child = () => {
        useEffect(fx, []);
        return <span>Child</span>;
      };

      const Hello = () => {
        const [count, setCounter] = useState(0);
        updCounter = setCounter;
        return (
          <h1>
            Count is
            {' '}
            {count}
            {count < 2 && <HookContainer renderFn={Child} />}
          </h1>
        );
      };

      util.renderIntoContainer(<HookContainer renderFn={Hello} />);

      updCounter((count) => count + 1);

      expect(fx).toHaveBeenCalledTimes(1);
      expect(dispose).not.toHaveBeenCalled();

      updCounter((count) => count + 1);

      expect(dispose).toHaveBeenCalledTimes(1);
    });

    test('effects co-dependent on state works ', () => {
      const EffectsStateChange = () => {
        const [stateA, setStateA] = useState(0);
        const [stateB, setStateB] = useState(0);

        useEffect(() => {
          if (stateB < 5) {
            setStateB(stateB + 1);
          }
        });

        useEffect(() => {
          setStateA(stateB);
        });

        return (
          <div>
            <div className="state">{stateA}</div>
            <div className="state">{stateB}</div>
          </div>
        );
      };

      const rendered = util.renderIntoContainer(<HookContainer renderFn={EffectsStateChange} />);

      rerender();

      const [stateA, stateB] = util.scryRenderedDOMElementsWithClass(rendered, 'state');
      expect(stateA.innerHTML).toEqual('5');

      expect(stateB.innerHTML).toEqual('5');
    });
  });

  describe('useMemo, useCallback', () => {
    test('useMemo is not called with empty dependency array', () => {
      const fx = jest.fn((count) => `Count is ${count}`);

      let updCounter: Dispatch<SetStateAction<number>> = () => {};

      const Hello = () => {
        const [count, setCounter] = useState(0);
        updCounter = setCounter;
        const expensiveCalc = useMemo(() => fx(count), []);
        return (
          <div>
            <h1>{expensiveCalc}</h1>
          </div>
        );
      };

      const rendered = util.renderIntoContainer(<HookContainer renderFn={Hello} />);
      const [h1] = util.scryRenderedDOMElementsWithTag(rendered, 'h1');

      expect(h1.innerHTML).toMatchInlineSnapshot('"Count is 0"');

      updCounter((count) => count + 1);

      expect(h1.innerHTML).toMatchInlineSnapshot('"Count is 0"');

      expect(fx).toHaveBeenCalledTimes(1);
    });
    test('useMemo callback is only called when its watch list changes', () => {
      const fx = jest.fn((count) => `Count is ${count}`);

      let updCounter: Dispatch<SetStateAction<number>> = () => {};
      let updBoolean: Dispatch<SetStateAction<boolean>> = () => {};

      const Hello = () => {
        const [count, setCounter] = useState(0);
        const [bool, setBool] = useState(false);
        updCounter = setCounter;
        updBoolean = setBool;
        const expensiveCalc = useMemo(() => fx(count), [count]);
        return (
          <div>
            <h1>{expensiveCalc}</h1>
            {bool}
          </div>
        );
      };

      const rendered = util.renderIntoContainer(<HookContainer renderFn={Hello} />);
      const [h1] = util.scryRenderedDOMElementsWithTag(rendered, 'h1');

      expect(h1.innerHTML).toMatchInlineSnapshot('"Count is 0"');

      updBoolean(true);

      expect(h1.innerHTML).toMatchInlineSnapshot('"Count is 0"');

      updCounter((count) => count + 1);

      expect(h1.innerHTML).toMatchInlineSnapshot('"Count is 1"');

      expect(fx).toHaveBeenCalledTimes(2);
    });

    test('useCallback works', () => {
      const Child = (props: { callback: ()=>number }) => <div>{props.callback()}</div>;
      let updCounter: Dispatch<SetStateAction<number>> = () => {};
      const Parent = () => {
        const [count, setCounter] = useState(0);
        updCounter = setCounter;
        const returnState = useCallback(() => count, []);
        return (
          <Child callback={returnState} />
        );
      };

      const rendered = util.renderIntoContainer(<HookContainer renderFn={Parent} />);

      const [div] = util.scryRenderedDOMElementsWithTag(rendered, 'div');
      expect(div.innerHTML).toEqual('0');
      updCounter((count) => count + 1);
      expect(div.innerHTML).toEqual('0');
    });
  });

  describe('useContext', () => {
    test('context from props', () => {
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
            <HookContainer renderFn={contextChildren} />
          </ConfigContext.Provider>
        </div>
      );
      const rendered = util.renderIntoContainer(
        <HookContainer renderFn={contextProvider} renderProps={{ rtlEnabled: true }} />,
      );
      const [contextChildrenValue] = util.scryRenderedDOMElementsWithTag(rendered, 'span');
      expect(contextChildrenValue.innerHTML).toBe('rtlEnabled');
    });

    test('useContext changed in children through callback', () => {
      interface NumberContextType {
        counter: number,
        increaseCounter: ()=>void;
      }
      const NumberContext = createContext<NumberContextType | undefined>(undefined);

      let incContext = () => {};
      const Child = () => {
        const numberContextConsumer = useContext(NumberContext);
        const increaseContext = useCallback(
          () => {
            numberContextConsumer.increaseCounter();
          },
          [numberContextConsumer],
        );
        incContext = increaseContext;

        const counter = useMemo(
          () => numberContextConsumer?.counter || 0,
          [numberContextConsumer],
        );
        return <div>{counter}</div>;
      };
      const Parent = () => {
        const [numState, setNumState] = useState<number>(0);
        const numberContextProvider = useCallback(
          () => ({
            counter: numState,
            increaseCounter: () => {
              setNumState((__state_numState) => __state_numState + 1);
            },
          }),
          [numState],
        );
        return (
          <NumberContext.Provider value={numberContextProvider()}>
            <HookContainer renderFn={Child} />
          </NumberContext.Provider>
        );
      };
      const rendered = util.renderIntoContainer(<HookContainer renderFn={Parent} />);
      const [div] = util.scryRenderedDOMElementsWithTag(rendered, 'div');
      expect(div.innerHTML).toEqual('0');
      incContext();
      expect(div.innerHTML).toEqual('1');
    });
  });

  describe('useImperativeHandle', () => {
    test('useRef with method call (useImperativeHandle)', () => {
      const mockFunc = jest.fn();

      const ChildrenComponent = (props: any, ref: any) => {
        const someMethod = () => { mockFunc(); };
        useImperativeHandle(ref,
          () => ({
            someMethod,
          }), []);
        return <div />;
      };
      function ChildrenComponentHook(props: any, ref: any) {
        return (
          <HookContainer
            renderFn={ChildrenComponent}
            renderProps={props}
            renderRef={ref}
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
      const rendered = util.renderIntoContainer(<HookContainer renderFn={parentComponent} />);
      const [button] = util.scryRenderedDOMElementsWithTag(rendered, 'button');

      emit('onClick', button);
      expect(mockFunc).toHaveBeenCalledTimes(1);
    });
  });
});

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
    let updCounter: Dispatch<SetStateAction<number>> = () => {};

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
});
