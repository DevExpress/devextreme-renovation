<script>
export const GridCell = {
  gridData: {
    type: String,
    default() {
      return "defaultValue";
    },
  },
};
export const GridRow = {
  cells: {
    type: Array,
  },
  __defaultNestedValues: {
    default() {
      return {
        cells: [
          {
            gridData:
              GridCell === undefined || GridCell === null
                ? undefined
                : GridCell.gridData?.default(),
          },
        ],
      };
    },
  },
};
export const WithNestedInput = {
  rows: {
    type: Array,
  },
  __defaultNestedValues: {
    default() {
      return { rows: [GridRow?.__defaultNestedValues.default()] };
    },
  },
};
export const EmptyClass = {};
export const FakeNested = {
  value: {
    type: Array,
  },
  __defaultNestedValues: {
    default() {
      return { value: [EmptyClass] };
    },
  },
};
</script>
