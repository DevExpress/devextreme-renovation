<template>
  <div />
</template>
<script>
import { WidgetInput } from "./nested-props";
export const DxWidget = {
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
      if (this.columns && this.columns.length) {
        return this.columns;
      }
      if (this.$slots.default) {
        const nested = this.__collectChildren(this.$slots.default);
        if (nested.length) {
          return nested;
        }
      }
    },
    __getNestedGridEditing() {
      if (this.gridEditing) {
        return this.gridEditing;
      }
      if (this.$slots.default) {
        const nested = this.__collectChildren(this.$slots.default);
        if (nested.length) {
          return nested?.[0];
        }
      }
    },
  },
  methods: {
    __getColumns() {
      return this.__getNestedColumn?.map((el) =>
        typeof el === "string" ? el : el.name
      );
    },
    __collectChildren(children) {
      const nestedComponents = children.filter((child) =>
        child.tag?.startsWith("Dx")
      );
      return nestedComponents.map((child) => {
        let name = child.tag.replace("Dx", "");
        name = name[0].toLowerCase() + name.slice(1);
        const collectedChildren = {};
        if (child.children) {
          this.__collectChildren(child.children).forEach(
            ({ __name, ...cProps }) => {
              if (!collectedChildren[__name]) {
                collectedChildren[__name] = [];
                collectedChildren[__name + "s"] = [];
              }
              collectedChildren[__name].push(cProps);
              collectedChildren[__name + "s"].push(cProps);
            }
          );
        }
        const childProps = {};
        if (child.data) {
          Object.keys(child.data.attrs).forEach((key) => {
            let attr = key.split("-");
            attr = [
              attr[0],
              ...attr.slice(1).map((a) => a[0].toUpperCase() + a.slice(1)),
            ].join("");
            childProps[attr] = child.data.attrs[key];
          });
        }

        return {
          ...collectedChildren,
          ...childProps,
          __name: name,
        };
      });
    },
  },
};
export default DxWidget;
</script>
