<template>
  <div ref="divRef"
    ><WidgetWithRefProp
      :parentRef="() => this.$refs.divRef"
      :nullableRef="() => nullableRef"
  /></div>
</template>
<script>
import WidgetWithRefProp from "./dx-widget-with-ref-prop";
const WidgetInput = {
  nullableRef: {
    type: Function,
  },
};
export const DxWidget = {
  name: "Widget",
  components: {
    WidgetWithRefProp,
  },
  props: WidgetInput,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { nullableRef: this.nullableRef };
    },
  },
  methods: {
    __getDirectly() {
      const divRefOuter = this.$refs.divRef?.outerHTML ?? "";
      const nullableRefOuter = this.nullableRef?.()?.outerHTML ?? "";
      return divRefOuter + nullableRefOuter;
    },
    __getDestructed() {
      const divRefOuter = this.$refs.divRef?.outerHTML ?? "";
      const nullableRefOuter = this.nullableRef?.()?.outerHTML ?? "";
      return divRefOuter + nullableRefOuter;
    },
  },
};
export default DxWidget;
</script>
