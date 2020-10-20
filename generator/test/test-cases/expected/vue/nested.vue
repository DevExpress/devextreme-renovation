<template>
  <div />
</template>
<script>
import { PickedProps, GridColumnProps } from "./nested-props";
export const CustomColumnComponent = (props) => {};
function __collectChildren(children) {
  return children.reduce((acc, child) => {
    const name = child.componentOptions?.Ctor?.extendOptions?.propName;
    const tag = child.tag || "";
    const isUnregisteredDxTag = tag.indexOf("Dx") === 0;
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
    } else if (isUnregisteredDxTag) {
      throw new Error(
        `Unknown custom element: <${tag}> - did you register the component correctly?'`
      );
    }
    return acc;
  }, []);
}
import {
  EditingProps,
  CustomProps,
  ColumnEditingProps,
  AnotherCustomProps,
} from "./nested-props";
export const DxColumn = {
  props: GridColumnProps,
};
DxColumn.propName = "columns";
export const DxEditing = {
  props: EditingProps,
};
DxEditing.propName = "editing";
export const DxColumnCustom = {
  props: CustomProps,
};
DxColumnCustom.propName = "custom";
export const DxColumnEditing = {
  props: ColumnEditingProps,
};
DxColumnEditing.propName = "editing";
export const DxEditingCustom = {
  props: CustomProps,
};
DxEditingCustom.propName = "custom";
export const DxEditingAnotherCustom = {
  props: AnotherCustomProps,
};
DxEditingAnotherCustom.propName = "anotherCustom";

export const DxWidget = {
  props: PickedProps,
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
      return this.columns ? this.columns : nested.length ? nested : undefined;
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
