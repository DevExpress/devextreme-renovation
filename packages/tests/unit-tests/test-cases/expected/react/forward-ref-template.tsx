import {
  GetPropsType,
  combineWithDefaultProps,
} from '@devextreme/runtime/react';
import { MutableRefObject } from 'react';
function view(model: RefOnChildrenTemplate) {
  return (
    <React.Fragment>
      {model.props.contentTemplate({ childRef: model.child })}
    </React.Fragment>
  );
}

interface PropsType {
  contentTemplate: any;
  contentRender?: any;
  contentComponent?: any;
}

const Props = {} as Partial<PropsType>;
import * as React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { getTemplate } from '@devextreme/runtime/react';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
type PropsModel = Required<
  Omit<GetPropsType<typeof Props>, 'contentRender' | 'contentComponent'>
> &
  Partial<
    Pick<GetPropsType<typeof Props>, 'contentRender' | 'contentComponent'>
  >;
interface RefOnChildrenTemplate {
  props: PropsModel & RestProps;
  child: any;
  restAttributes: RestProps;
}
export default function RefOnChildrenTemplate(
  inProps: typeof Props & RestProps
) {
  const props = combineWithDefaultProps<PropsModel>(Props, inProps);
  const __child: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { contentComponent, contentRender, contentTemplate, ...restProps } =
        props;
      return restProps as RestProps;
    },
    [props]
  );
  useEffect(() => {
    if (__child.current) {
      __child.current.innerHTML += 'ParentText';
    }
  }, []);

  return view({
    props: {
      ...props,
      contentTemplate: getTemplate(
        props.contentTemplate,
        props.contentRender,
        props.contentComponent
      ),
    },
    child: __child,
    restAttributes: __restAttributes(),
  });
}
