import { SimpleContext } from './context';
function view(model: ConsumerComponent) {
  return (
    <span id="3">
      Consumer Value:
      {model.contextConsumer}
    </span>
  );
}

export type PropsType = {};
const Props: PropsType = {};
import {
  useContext,
  useCallback,
  InfernoWrapperComponent,
} from '@devextreme/runtime/inferno-hooks';

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
};
interface ConsumerComponent {
  props: typeof Props & RestProps;
  contextConsumer: number;
  restAttributes: RestProps;
}

function ReactConsumerComponent(props: typeof Props & RestProps) {
  const contextConsumer = useContext(SimpleContext);
  const __restAttributes = useCallback(
    function __restAttributes(): RestProps {
      const { ...restProps } = props;
      return restProps;
    },
    [props]
  );

  return view({
    props: { ...props },
    contextConsumer,
    restAttributes: __restAttributes(),
  });
}

HooksConsumerComponent.defaultProps = Props;

function HooksConsumerComponent(props: typeof Props & RestProps) {
  return (
    <InfernoWrapperComponent
      renderFn={ReactConsumerComponent}
      renderProps={props}
    />
  );
}
export { HooksConsumerComponent as ConsumerComponent };
export default HooksConsumerComponent;
