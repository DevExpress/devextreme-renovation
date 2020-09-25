<template>
  <div ref="divRef"
    ><WidgetWithRefProp
      :parentRef="() => this.$refs.divRef"
      :nullableRef="() => props.nullableRef"
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
  components: {
    WidgetWithRefProp,
  },
  props: WidgetInput,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { nullableRef: this.nullableRef?.() };
    },
  },
  methods: {
    __getSize() {
      return this.$refs.divRef.outerHTML + this.props.nullableRef?.outerHTML;
    },
    __getNullable() {
      return this.props.nullableRef?.outerHTML;
    },
  },
};
export default DxWidget;
</script>
