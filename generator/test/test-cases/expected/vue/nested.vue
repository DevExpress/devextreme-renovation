<template>
  <div />
</template>
<script>
import { WidgetInput } from "./nested-props";
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
    __getNestedColumn() {
      if (this.columns && this.columns.length) {
        return this.columns;
      }
      if (this.$slots.default) {
        const nested = this.__collectChildren(this.$slots.default).filter(
          (c) => c.__name === "columns"
        );
        if (nested.length) {
          return nested;
        }
      }
    },
    __getNestedEditing() {
      if (this.editing) {
        return this.editing;
      }
      if (this.$slots.default) {
        const nested = this.__collectChildren(this.$slots.default).filter(
          (c) => c.__name === "editing"
        );
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
      return children.reduce((acc, child) => {
        const name = child.componentOptions?.Ctor?.extendOptions?.propName;
        if (name) {
          const collectedChildren = {};
          const childProps = child.componentOptions.propsData;
          if (child.componentOptions.children) {
            this.__collectChildren(child.componentOptions.children).forEach(
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
    },
  },
};
export default DxWidget;
</script>
