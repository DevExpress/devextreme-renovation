<script>
import { ChildProps, DxChild as Child } from "./child";
export const BetweenProps = {
  childTemplate: {
    type: String,
    default() {
      return "childTemplate";
    },
    defaultTemplate() {
      return Child;
    },
  },
};
</script>
