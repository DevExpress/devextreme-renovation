import { Component } from 'inferno';
import { createRecorder, renderChild } from './recorder';
import { EffectsHost } from './effects_host';

export interface RefObject<T> {
  current: T | null;
}
export class HookContainer extends Component
  <{
    renderFn: (props: any, ref?: any) => JSX.Element,
    renderProps?: Record<string, unknown>,
    renderRef?: RefObject<Record<string, unknown>>,
  },
  Record<string, unknown>
  > {
  recorder!: ReturnType<typeof createRecorder> | undefined;

  // eslint-disable-next-line react/state-in-constructor
  state = {} as Record<string, unknown>;

  refs: any;

  componentWillMount(): void {
    EffectsHost.increment();
  }

  componentDidMount(): void {
    if (this.recorder) {
      this.recorder.componentDidMount();
    }
    EffectsHost.decrement();
  }

  shouldComponentUpdate(
    nextProps: Record<string, unknown>,
    nextState: Record<string, unknown>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: Record<string, unknown> | undefined,
  ): boolean {
    if (!this.recorder) {
      return true;
    }
    const result = this.recorder.shouldComponentUpdate(nextProps, nextState, context);
    if (result) {
      EffectsHost.increment();
    }
    return result;
  }

  componentDidUpdate(): void {
    if (this.recorder) {
      this.recorder.componentDidUpdate();
    }
    EffectsHost.decrement();
  }

  componentWillUnmount(): void {
    this.dispose();
  }

  getHook(dependencies: number | unknown[] | undefined, fn: any): any {
    if (!this.recorder) {
      this.recorder = createRecorder(this);
    }
    return this.recorder.getHook(dependencies, fn);
  }

  getContextValue(consumer: { id: number }): unknown {
    return this.context[consumer.id];
  }

  dispose(): void {
    if (this.recorder) {
      this.recorder.dispose();
    }
    this.state = {};
    this.recorder = undefined;
  }

  render(): JSX.Element {
    return this.recorder
      ? this.recorder.renderResult
      : renderChild(this, this.props as any, this.context);
  }
}
