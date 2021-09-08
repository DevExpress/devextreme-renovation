import { Options, AdditionalOptions } from "./types.d";

export declare type WidgetPropsType = {
  height?: number;
  data?: Options;
  info?: AdditionalOptions;
};
const WidgetProps: WidgetPropsType = {
  height: 10,
  get data() {
    return { value: "" };
  },
  get info() {
    return { index: 0 };
  },
};
export default WidgetProps;
