<template>
  <div />
</template>
<script>
const WidgetInput = {
  collect: {
    type: Array
  }
};

export default {
  props: WidgetInput,
  methods: {
    __getColumns() {
      return (collect || this.__getNestedFromChild("Dx"))?.map(el =>
        typeof el === "string" ? el : el.name
      );
    },
    __isEditable() {
      return (editing || this.__getNestedFromChild("DxEditing")?.[0])?.editEnabled;
    },
    __restAttributes() {
      return {};
    },
    __getNestedFromChild(typeName) {
      const children = this.$options._renderChildren || [],
        nestedComponents = children.filter(child => child.tag === typeName);
      return nestedComponents.map(child => child.data?.attrs || {});
    },
    props() {
      return {
        collect: (collect || this.__getNestedFromChild("Dx")),
        editing: (editing || this.__getNestedFromChild("DxEditing")?.[0])
      };
    }
  }
};
</script>