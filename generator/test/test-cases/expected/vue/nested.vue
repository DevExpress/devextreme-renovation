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
        this.__getNestedGridEditing?.editEnabled ||
        this.__getNestedGridEditing?.custom?.length
      );
    },
    __restAttributes() {
      return {};
    },
    props() {
      return {
        columns: this.__getNestedColumn,
        gridEditing: this.__getNestedGridEditing,
      };
    },
    __getNestedColumn() {
      return this.columns || this.__getNestedFromChild("DxColumn");
    },
    __getNestedGridEditing() {
      return (
        this.gridEditing || this.__getNestedFromChild("DxGridEditing")?.[0]
      );
    },
  },
  methods: {
    __getColumns() {
      return this.__getNestedColumn?.map((el) =>
        typeof el === "string" ? el : el.name
      );
    },
    __getNestedFromChild(typeName) {
      const children = this.$options._renderChildren || [],
        nestedComponents = children.filter((child) => child.tag === typeName);
      return nestedComponents.map((child) => child.data?.attrs || {});
    },
  },
};
</script>
