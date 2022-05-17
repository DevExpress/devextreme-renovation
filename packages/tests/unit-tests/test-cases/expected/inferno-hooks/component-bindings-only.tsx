import { Options, AdditionalOptions } from './types.d';

interface WidgetPropsType {
  height?: number;
  data?: Options;
  info?: AdditionalOptions;
}

const WidgetProps = {
  height: 10,
  data: Object.freeze({ value: '' }) as any,
  info: Object.freeze({ index: 0 }) as any,
} as Partial<WidgetPropsType>;
export default WidgetProps;
