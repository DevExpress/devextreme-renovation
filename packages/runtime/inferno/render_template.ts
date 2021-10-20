import { render } from 'inferno';
import { createElement } from 'inferno-create-element';

export function renderTemplate(
  template: string,
  props: {
    data: unknown,
    index: number,
    container: HTMLElement & { get: (index: number) => HTMLElement }
  },
  _component?: unknown,
): void {
  setTimeout(() => {
    render(
      createElement(template, props), props.container?.get(0),
    );
  }, 0);
}

export const hasTemplate = (
  name: string,
  properties: Record<string, unknown>,
  _component: unknown,
): boolean => !!properties[name];
