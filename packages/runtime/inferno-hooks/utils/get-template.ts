import {
  normalizeProps, createComponentVNode, Props, VNode,
} from 'inferno';

type InfernoComponent = Parameters<typeof createComponentVNode>[1];
export const getTemplate = (TemplateProp:
InfernoComponent & { defaultProps: unknown }):
  InfernoComponent | ((props?: (Props<unknown> & unknown) | null) => VNode) => (
  TemplateProp && TemplateProp.defaultProps
    ? (
      props?: (Props<unknown> & unknown) | null,
    ): VNode => normalizeProps(createComponentVNode(2, TemplateProp, { ...props }))
    : TemplateProp
);
