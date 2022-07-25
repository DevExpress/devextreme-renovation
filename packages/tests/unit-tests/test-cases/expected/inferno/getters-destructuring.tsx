import {
  BaseInfernoComponent,
} from '@devextreme/runtime/inferno';

export type WidgetPropsType = {
  someProp: string;
  type?: string;
  objectProp?: { someField: number };
};
const WidgetProps: WidgetPropsType = {
  someProp: '',
  type: '',
};
interface FirstGetter {
  field1: string;
  field2: number;
  field3: number;
}

interface GetterType {
  stateField: string;
  propField: string;
}
const view = () => <div></div>;

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};

class Widget extends BaseInfernoComponent<any> {
  state: { someState: string };

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      someState: '',
    };
    this.someMethodFromDestructured =
      this.someMethodFromDestructured.bind(this);
    this.changeState = this.changeState.bind(this);
  }

  someState!: string;

  get arrayFromObj(): (string | undefined)[] {
    if (this.__getterCache['arrayFromObj'] !== undefined) {
      return this.__getterCache['arrayFromObj'];
    }
    return (this.__getterCache['arrayFromObj'] = ((): (
      | string
      | undefined
    )[] => {
      const { propField, stateField } = this.someObj;
      return [stateField, propField];
    })());
  }
  get arrayFromArr(): (string | undefined)[] {
    if (this.__getterCache['arrayFromArr'] !== undefined) {
      return this.__getterCache['arrayFromArr'];
    }
    return (this.__getterCache['arrayFromArr'] = ((): (
      | string
      | undefined
    )[] => {
      const [stateField, propField] = this.arrayFromObj;
      return [stateField, propField];
    })());
  }
  get someObj(): GetterType {
    if (this.__getterCache['someObj'] !== undefined) {
      return this.__getterCache['someObj'];
    }
    return (this.__getterCache['someObj'] = ((): GetterType => {
      return {
        stateField: this.state.someState,
        propField: this.props.someProp,
      };
    })());
  }
  get objectFromDestructured(): GetterType {
    if (this.__getterCache['objectFromDestructured'] !== undefined) {
      return this.__getterCache['objectFromDestructured'];
    }
    return (this.__getterCache['objectFromDestructured'] = ((): GetterType => {
      const { propField, stateField } = this.someObj;
      return { stateField, propField };
    })());
  }
  get someGetter(): GetterType | undefined {
    if (this.__getterCache['someGetter'] !== undefined) {
      return this.__getterCache['someGetter'];
    }
    return (this.__getterCache['someGetter'] = ((): GetterType | undefined => {
      const { propField, stateField: stateField2 } = this.someObj;
      return { stateField: stateField2, propField };
    })());
  }
  someMethodFromDestructured(): GetterType {
    const { propField, stateField } = this.objectFromDestructured;
    return { stateField, propField };
  }
  get restAttributes(): RestProps {
    const { objectProp, someProp, type, ...restProps } = this.props as any;
    return restProps;
  }
  changeState(newValue: string): any {
    this.setState((__state_argument: any) => ({ someState: newValue }));
  }
  __getterCache: {
    arrayFromObj?: (string | undefined)[];
    arrayFromArr?: (string | undefined)[];
    someObj?: GetterType;
    objectFromDestructured?: GetterType;
    someGetter?: GetterType | undefined;
  } = {};
  componentWillUpdate(nextProps, nextState, context) {
    if (
      this.state['someState'] !== nextState['someState'] ||
      this.props['someProp'] !== nextProps['someProp']
    ) {
      this.__getterCache['arrayFromObj'] = undefined;
    }
    if (
      this.state['someState'] !== nextState['someState'] ||
      this.props['someProp'] !== nextProps['someProp']
    ) {
      this.__getterCache['arrayFromArr'] = undefined;
    }
    if (
      this.state['someState'] !== nextState['someState'] ||
      this.props['someProp'] !== nextProps['someProp']
    ) {
      this.__getterCache['someObj'] = undefined;
    }
    if (
      this.state['someState'] !== nextState['someState'] ||
      this.props['someProp'] !== nextProps['someProp']
    ) {
      this.__getterCache['objectFromDestructured'] = undefined;
    }
    if (
      this.state['someState'] !== nextState['someState'] ||
      this.props['someProp'] !== nextProps['someProp']
    ) {
      this.__getterCache['someGetter'] = undefined;
    }
  }
  render() {
    const props = this.props;
    return view();
  }
}

Widget.defaultProps = WidgetProps;
