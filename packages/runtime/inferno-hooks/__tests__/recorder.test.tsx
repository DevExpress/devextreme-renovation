/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRecorder } from '../recorder';

jest.mock('../container');

describe('Recorder', () => {
  describe('shouldComponentUpdate', () => {
    test('an impure component should be updated if the props and the state are the same.', () => {
      const props = {
        renderProps: {},
        renderFn: jest.fn(),
        pure: false,
      };
      const component = { props } as any;
      const recorder = createRecorder(component);
      const shouldUpdate = recorder.shouldComponentUpdate(
        props,
        component.state,
        {},
      );

      expect(shouldUpdate).toBe(true);
    });

    test('an impure component should be updated if the props are changed.', () => {
      const props = {
        renderProps: {},
        renderFn: jest.fn(),
        pure: false,
      };
      const component = { props } as any;
      const recorder = createRecorder(component);
      const shouldUpdate = recorder.shouldComponentUpdate(
        { ...props, renderProps: { newProps: 1 } },
        component.state,
        {},
      );

      expect(shouldUpdate).toBe(true);
      expect(props.renderFn).toBeCalled();
    });

    test('an impure component should be updated if the state is changed.', () => {
      const props = {
        renderProps: {},
        renderFn: jest.fn(),
        pure: false,
      };
      const component = { props } as any;
      const recorder = createRecorder(component);
      const shouldUpdate = recorder.shouldComponentUpdate(
        props,
        { newStatePorps: 1 },
        {},
      );

      expect(shouldUpdate).toBe(true);
      expect(props.renderFn).toBeCalled();
    });

    test('a pure component should not be updated if the props and the state are the same', () => {
      const props = {
        renderProps: {},
        renderFn: jest.fn(),
        pure: true,
      };
      const component = { props } as any;
      const recorder = createRecorder(component);

      const shouldUpdate = recorder.shouldComponentUpdate(
        props,
        component.state,
        {},
      );

      expect(shouldUpdate).toBe(false);
      expect(props.renderFn).not.toBeCalled();
    });

    test('a pure component should be updated if the props are changed', () => {
      const renderProps = { prop: 1 };
      const props = {
        renderProps,
        renderFn: jest.fn(),
        pure: true,
      };
      const component = { props } as any;
      const recorder = createRecorder(component);

      const shouldUpdate = recorder.shouldComponentUpdate(
        { ...props, renderProps: { newProp: true } },
        component.state,
        {},
      );

      expect(shouldUpdate).toBe(true);
      expect(props.renderFn).toBeCalled();
    });

    test('a pure component should be updated if the state is changed', () => {
      const props = {
        renderProps: {},
        renderFn: jest.fn(),
        pure: true,
      };
      const component = { props } as any;
      const recorder = createRecorder(component);

      const shouldUpdate = recorder.shouldComponentUpdate(
        props,
        { newStateProp: true },
        {},
      );

      expect(shouldUpdate).toBe(true);
      expect(props.renderFn).toBeCalled();
    });
  });
});
