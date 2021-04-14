import { createPortal } from 'inferno';

declare type PortalProps = {
  container?: HTMLElement | null;
  children: any;
};
export const Portal = ({ container, children }: PortalProps): any => {
  if (container) {
    return createPortal(children, container);
  }
  return null;
};
