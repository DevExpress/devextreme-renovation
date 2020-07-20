<template>
  <div />
</template>
<script>
import { WidgetInput } from "./nested-props";

export default {
  props: WidgetInput,
  computed: {
    __isEditable() {
      return (
        this.gridEditing || this.__getNestedFromChild("DxGridEditing")?.[0]
      )?.editEnabled;
    },
    __restAttributes() {
      return {};
    },
    props() {
      return {
        columns: this.columns || this.__getNestedFromChild("DxColumn"),
        gridEditing:
          this.gridEditing || this.__getNestedFromChild("DxGridEditing")?.[0],
      };
    },
  },
  methods: {
    __getColumns() {
      return (
        this.columns || this.__getNestedFromChild("DxColumn")
      )?.map((el) => (typeof el === "string" ? el : el.name));
    },
    __getNestedFromChild(typeName) {
      const children = this.$options._renderChildren || [],
        nestedComponents = children.filter((child) => child.tag === typeName);
      return nestedComponents.map((child) => child.data?.attrs || {});
    },
  },
};
</script>
