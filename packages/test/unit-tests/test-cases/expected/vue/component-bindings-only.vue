<script>
import { Options, AdditionalOptions } from "./types";
const WidgetProps = {
  height: {
    type: Number,
    default() {
      return 10;
    },
  },
  data: {
    default() {
      return { value: "" };
    },
  },
  info: {
    default() {
      return { index: 0 };
    },
  },
};
export default WidgetProps;
</script>
