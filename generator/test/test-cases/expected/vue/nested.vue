<template>
  <div />
</template>
<script>
import { WidgetInput } from "./nested-props";
function __collectChildren(children) {
  return children.reduce((acc, child) => {
    const name = child.componentOptions?.Ctor?.extendOptions?.propName;
    if (name) {
      const collectedChildren = {};
      const childProps = child.componentOptions.propsData;
      if (child.componentOptions.children) {
        __collectChildren(child.componentOptions.children).forEach(
          ({ __name, ...cProps }) => {
            if (__name) {
              if (!collectedChildren[__name]) {
                collectedChildren[__name] = [];
              }
              collectedChildren[__name].push(cProps);
            }
          }
        );
      }

      acc.push({
        ...collectedChildren,
        ...childProps,
        __name: name,
      });
    }
    return acc;
  }, []);
}
import {
  GridColumn,
  Editing,
  ColumnEditing,
  Custom,
  AnotherCustom,
} from "./nested-props";
export const DxColumn = {
  props: GridColumn,
};
DxColumn.propName = "columns";
export const DxEditing = {
  props: Editing,
};
DxEditing.propName = "editing";
export const DxColumnEditing = {
  props: ColumnEditing,
};
DxColumnEditing.propName = "editing";
export const DxEditingCustom = {
  props: Custom,
};
DxEditingCustom.propName = "custom";
export const DxEditingAnotherCustom = {
  props: AnotherCustom,
};
DxEditingAnotherCustom.propName = "anotherCustom";

export const DxWidget = {
  props: WidgetInput,
  computed: {
    __isEditable() {
      return (
        this.__getNestedEditing?.editEnabled ||
        this.__getNestedEditing?.custom?.length
      );
    },
    __restAttributes() {
      return {};
    },
    props() {
      return {
        columns: this.__getNestedColumn,
        editing: this.__getNestedEditing,
      };
    },
    __nestedChildren() {
      return this.$slots.default ? __collectChildren(this.$slots.default) : [];
    },
    __getNestedColumn() {
      const nested = this.__nestedChildren.filter(
        (child) => child.__name === "columns"
      );
      return this.columns && this.columns.length
        ? this.columns
        : nested.length
        ? nested
        : undefined;
    },
    __getNestedEditing() {
      const nested = this.__nestedChildren.filter(
        (child) => child.__name === "editing"
      );
      return this.editing
        ? this.editing
        : nested.length
        ? nested?.[0]
        : undefined;
    },
  },
  methods: {
    __getColumns() {
      return this.__getNestedColumn?.map((el) =>
        typeof el === "string" ? el : el.name
      );
    },
  },
};
export default DxWidget;
</script>
