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
};
export const WithNestedInput = {
  rows: {
    type: Array,
  },
};
</script>
