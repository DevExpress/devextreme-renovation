<template>
  <div>
    {{(model.props.data===undefined||model.props.data===null?undefined:model.props.data.value)}}
  </div>
</template>
<script>
import Props from "./component-bindings-only";
const WidgetProps = {
  data: {
    type: Object,
    default() {
      return typeof Props.data.default === "function"
        ? Props.data.default()
        : Props.data.default;
    },
  },
  info: {
    type: Object,
    default() {
      return typeof Props.info.default === "function"
        ? Props.info.default()
        : Props.info.default;
    },
  },
};
export const DxWidget = {
  props: WidgetProps,
  data() {
    return {
      innerData: { value: "" },
    };
  },
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { data: this.data, info: this.info };
    },
  },
};
export default DxWidget;
</script>
