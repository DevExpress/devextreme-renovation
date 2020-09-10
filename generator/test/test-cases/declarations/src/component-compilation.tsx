// NOTE: this file uses for checking compilation
import { WidgetWithProps } from "./dx-widget-with-props";

const WithEmptyProps = new WidgetWithProps({});
const WithProps = new WidgetWithProps({ value: "1" });
const JsxEmpty = <WidgetWithProps />;
const JsxWithProps = <WidgetWithProps value={"1"} key={0} ref={{} as any} />;
