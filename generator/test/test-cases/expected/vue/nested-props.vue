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
  __defaultNestedValues: () => {
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
};
export const WithNestedInput = {
  rows: {
    type: Array,
  },
  __defaultNestedValues: () => {
    return { rows: [GridRow?.__defaultNestedValues()] };
  },
};
</script>
