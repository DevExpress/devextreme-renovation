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
      const defaultProps =
        child.componentOptions?.Ctor?.extendOptions?.defaultProps || {};
      const __defaultNestedValues =
        child.componentOptions?.Ctor?.extendOptions?.computed?.__defaultNestedValues() ||
        {};
      const childProps = Object.assign(
        { __defaultNestedValues },
        defaultProps,
        child.componentOptions.propsData
      );
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
function __extractDefaultValues(propsObject) {
  return Object.entries(propsObject)
    .filter(([key, value]) => value?.default)
    .reduce((accObj, [key, value]) => {
      accObj[key] = value.default();
      return accObj;
    }, {});
}
import { GridRow, GridCell } from "./nested-props";
export const DxRow = {
  props: (({ __defaultNestedValues, ...o }) => o)(GridRow),
  computed: {
    __defaultNestedValues() {
      return GridRow.__defaultNestedValues;
    },
  },
};
DxRow.propName = "rows";
DxRow.defaultProps = __extractDefaultValues(GridRow);
export const DxRowCell = {
  props: GridCell,
};
DxRowCell.propName = "cells";
DxRowCell.defaultProps = __extractDefaultValues(GridCell);

export const DxWithNested = {
  name: "WithNested",
  props: (({ __defaultNestedValues, ...o }) => o)(WithNestedInput),
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
      const nested = this.__nestedChildren
        .filter((child) => child.__name === "rows")
        .map((n) => {
          if (
            !Object.keys(n).some(
              (k) => k !== "__name" && k !== "__defaultNestedValues"
            )
          ) {
            return n?.__defaultNestedValues?.() || n;
          }
          return n;
        });
      return this.rows
        ? this.rows
        : nested.length
        ? nested
        : this?.__defaultNestedValues()?.rows;
    },
    __defaultNestedValues() {
      return WithNestedInput.__defaultNestedValues;
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
