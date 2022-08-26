import {
  BaseInfernoComponent,
} from '@devextreme/runtime/inferno';
import {
  InterfaceTemplateInput as externalInterface,
  Options as externalType,
} from './types.d';

export type WidgetPropsType = {
  someProp: string;
  type?: string;
  currentDate: Date | number | string;
  defaultCurrentDate: Date | number | string;
  currentDateChange?: (currentDate: Date | number | string) => void;
};
const WidgetProps: WidgetPropsType = {
  someProp: '',
  type: '',
  defaultCurrentDate: Object.freeze(new Date()) as any,
  currentDateChange: () => {},
} as any as WidgetPropsType;
interface internalInterface {
  field1: { a: string };
  field2: number;
  field3: number;
}
type internalType = { a: string };
const view = () => <div></div>;

type RestProps = {
  className?: string;
  style?: { [name: string]: any };
  key?: any;
  ref?: any;
  children?: any;
};

class Widget extends BaseInfernoComponent<any> {
  state: { currentDate: Date | number | string };

  refs: any;

  constructor(props: any) {
    super(props);
    this.state = {
      currentDate:
        this.props.currentDate !== undefined
          ? this.props.currentDate
          : this.props.defaultCurrentDate,
    };
  }

  get internalInterfaceGetter(): internalInterface {
    if (this.__getterCache['internalInterfaceGetter'] !== undefined) {
      return this.__getterCache['internalInterfaceGetter'];
    }
    return (this.__getterCache['internalInterfaceGetter'] =
      ((): internalInterface => {
        return { field1: { a: this.props.someProp }, field2: 2, field3: 3 };
      })());
  }
  get internalTypeGetter(): internalType {
    if (this.__getterCache['internalTypeGetter'] !== undefined) {
      return this.__getterCache['internalTypeGetter'];
    }
    return (this.__getterCache['internalTypeGetter'] = ((): internalType => {
      return { a: '1' };
    })());
  }
  get externalInterfaceGetter(): externalInterface {
    if (this.__getterCache['externalInterfaceGetter'] !== undefined) {
      return this.__getterCache['externalInterfaceGetter'];
    }
    return (this.__getterCache['externalInterfaceGetter'] =
      ((): externalInterface => {
        return { inputInt: 2 };
      })());
  }
  get externalTypeGetter(): externalType {
    if (this.__getterCache['externalTypeGetter'] !== undefined) {
      return this.__getterCache['externalTypeGetter'];
    }
    return (this.__getterCache['externalTypeGetter'] = ((): externalType => {
      return { value: '' };
    })());
  }
  get someDate(): Date {
    if (this.__getterCache['someDate'] !== undefined) {
      return this.__getterCache['someDate'];
    }
    return (this.__getterCache['someDate'] = ((): Date => {
      return new Date(
        this.props.currentDate !== undefined
          ? this.props.currentDate
          : this.state.currentDate
      );
    })());
  }
  get restAttributes(): RestProps {
    const {
      currentDate,
      currentDateChange,
      defaultCurrentDate,
      someProp,
      type,
      ...restProps
    } = {
      ...this.props,
      currentDate:
        this.props.currentDate !== undefined
          ? this.props.currentDate
          : this.state.currentDate,
    } as any;
    return restProps;
  }
  __getterCache: {
    internalInterfaceGetter?: internalInterface;
    internalTypeGetter?: internalType;
    externalInterfaceGetter?: externalInterface;
    externalTypeGetter?: externalType;
    someDate?: Date;
  } = {};
  componentWillUpdate(nextProps, nextState, context) {
    if (this.props['someProp'] !== nextProps['someProp']) {
      this.__getterCache['internalInterfaceGetter'] = undefined;
    }
    if (
      this.state['currentDate'] !== nextState['currentDate'] ||
      this.props['currentDate'] !== nextProps['currentDate']
    ) {
      this.__getterCache['someDate'] = undefined;
    }
  }
  render() {
    const props = this.props;
    return view();
  }
}

Widget.defaultProps = WidgetProps;
