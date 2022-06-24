import {
  SFC, ForwardRef as infernoForwardRefType, forwardRef as infernoForwardRef,
} from 'inferno';
import type { RefObject } from './container';

export function forwardRef<T = Record<string, unknown>, P = Record<string, unknown>>(
  render: (props: T, ref: RefObject<P>) => InfernoElement<T>,
): SFC<T> & infernoForwardRefType {
  const result = infernoForwardRef(render) as SFC<T> & infernoForwardRefType;
  Object.defineProperty(render, 'defaultProps', {
    get: () => result.defaultProps,
  });
  return result;
}
