import { createPortal, VNode } from 'inferno';

type PortalProps = {
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
