import { createPortal, VNode } from 'inferno';

type PortalProps = {
  // eslint-disable-next-line react/require-default-props
  container?: HTMLElement | null;
  children: unknown;
};
export const Portal = ({
  container,
  children,
}: PortalProps): VNode | null => {
  if (container) {
    return createPortal(children, container);
  }
  return null;
};
