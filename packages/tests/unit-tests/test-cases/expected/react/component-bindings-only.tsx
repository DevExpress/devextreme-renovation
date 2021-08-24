import { Options, AdditionalOptions } from "./types.d";

export declare type WidgetPropsType = {
  height?: number;
  data?: Options;
  info?: AdditionalOptions;
};
const WidgetProps: WidgetPropsType = Object.defineProperties(
  { height: 10 },
  {
    data: {
      enumerable: true,
      get: function () {
        return { value: "" };
      },
    },
    info: {
      enumerable: true,
      get: function () {
        return { index: 0 };
      },
    },
  }
);
export default WidgetProps;
