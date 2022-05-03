import { MutableRefObject } from 'react';
function view(model: EffectsDOMUpdate) {
  return (
    <div>
      <span>{model.props.text}</span>

      <div
        id={model.props.name}
        ref={model.divRef}
        style={normalizeStyles({ backgroundColor: '#b3b3b3' })}
      ></div>
    </div>
  );
}

export type PropsType = {
  name?: string;
  text: string;
};
const Props: PropsType = {} as any as PropsType;
import { useCallback, useEffect, useRef } from 'react';
import { normalizeStyles } from '@devextreme/runtime/common';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface EffectsDOMUpdate {
  props: typeof Props & RestProps;
  divRef: any;
  restAttributes: RestProps;
}

export default function EffectsDOMUpdate(props: typeof Props & RestProps) {
  const __divRef: MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);

  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { name, text, ...restProps } = props;
      return restProps;
    },
    [props]
  );
  useEffect(() => {
    __divRef.current?.insertAdjacentText('beforeend', `(no deps)`);
  }, []);
  useEffect(() => {
    __divRef.current?.insertAdjacentText('beforeend', `(${props.text} deps)`);
  }, [props.text]);
  useEffect(() => {
    __divRef.current?.insertAdjacentText('beforeend', '(always)');
  });
  useEffect(() => {
    __divRef.current?.insertAdjacentText('beforeend', `(once)`);
  }, []);

  return view({
    props: { ...props },
    divRef: __divRef,
    restAttributes: __restAttributes(),
  });
}

EffectsDOMUpdate.defaultProps = Props;
