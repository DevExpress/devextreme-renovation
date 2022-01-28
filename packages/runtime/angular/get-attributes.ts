import { ElementRef } from '@angular/core';

export function getAttributes(element: ElementRef<HTMLElement>): Record<string, unknown> {
  const attributes: Record<string, string> = {};
  Array.from(
    element.nativeElement.attributes,
  ).forEach(({ name, value }) => {
    if (name.startsWith('ng-reflect')) return;
    attributes[name] = value;
  });
  if (attributes.style) {
    const styleText = attributes.style.replace(/display: contents[;]?/, '');

    if (styleText) {
      const style: Record<string, unknown> = {
        toString: () => styleText,
      };
      styleText.split(';').forEach((definition) => {
        const [name, value] = definition.split(':');
        if (name && value) {
          style[name.trim()] = value.trim();
        }
      });
      return { ...attributes, style };
    }
  }
  return attributes;
}
