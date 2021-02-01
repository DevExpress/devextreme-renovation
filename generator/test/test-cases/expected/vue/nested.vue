<template>
  <div
    ><template v-if="__getNestedRow"
      ><template v-if="__getNestedRow.length"
        ><template v-for="(_, index) of __getNestedRow"
          ><span :key="index">{{ __getRowCells(index) }}<br /></span></template
      ></template>
      <span v-else>Empty Array</span></template
    >
    <span v-else>No Data</span></div
  >
</template>
<script>
import { WithNestedInput } from "./nested-props";
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
import { GridRow, GridCell } from "./nested-props";
export const DxRow = {
  props: GridRow,
};
DxRow.propName = "rows";
DxRow.default = GridRow.default();
export const DxRowCell = {
  props: GridCell,
};
DxRowCell.propName = "cells";
DxRowCell.default = GridCell.default();

export const DxWithNested = {
  name: "WithNested",
  props: WithNestedInput,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { rows: this.__getNestedRow };
    },
    __nestedChildren() {
      return this.$slots.default ? __collectChildren(this.$slots.default) : [];
    },
    __getNestedRow() {
      const nested = this.__nestedChildren.filter(
        (child) => child.__name === "rows"
      );
      return this.rows ? this.rows : nested.length ? nested : undefined;
    },
  },
  methods: {
    __getRowCells(index) {
      const cells = this.__getNestedRow?.[index].cells;
      return (
        cells
          ?.map((cell) => (typeof cell === "string" ? cell : cell.gridData))
          .join("|") || []
      );
    },
  },
};
export default DxWithNested;
</script>
