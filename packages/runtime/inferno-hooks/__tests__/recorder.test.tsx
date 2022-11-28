import { createRecorder } from '../recorder';

jest.mock('../container');

describe('Recorder', () => {
  describe('shouldComponentUpdate', () => {
    test('not pure component should always render', () => {
      const props = {
        renderProps: {},
        renderFn: jest.fn(),
        pure: false,
      };
      const component = { props } as any;
      const recorder = createRecorder(component as any);
      expect(recorder.shouldComponentUpdate(props, component.state, {})).toBe(true);
    });
    test('pure component should not updated if props and satet is same', () => {
      const props = {
        renderProps: {},
        pure: true,
      };
      const component = { props } as any;
      const recorder = createRecorder(component as any);
      expect(recorder.shouldComponentUpdate(props, component.state, {})).toBe(false);
    });
    test('pure component should updated if props changed', () => {
      const renderProps = { a: 1 };
      const props = {
        renderProps,
        renderFn: jest.fn(),
        pure: true,
      };
      const component = { props } as any;
      const recorder = createRecorder(component as any);
      expect(
        recorder.shouldComponentUpdate({ ...props, renderProps: { a: 2 } }, component.state, {}),
      )
        .toBe(true);
    });
    test('pure component should updated if state changed', () => {
      const props = {
        renderProps: {},
        renderFn: jest.fn(),
        pure: true,
      };
      const component = { props } as any;
      const recorder = createRecorder(component as any);
      expect(recorder.shouldComponentUpdate(props, { newStateProp: true }, {})).toBe(true);
    });
  });
});
