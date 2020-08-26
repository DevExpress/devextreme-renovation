<script>
export const GridColumnProps = {
  name: {
    type: String,
    default() {
      return "";
    },
  },
  index: {
    type: Number,
    default() {
      return 0;
    },
  },
  custom: {
    type: Array,
  },
};
export const CustomProps = {};
export const AnotherCustomProps = {};
export const EditingProps = {
  editEnabled: {
    type: Boolean,
    default() {
      return false;
    },
  },
  custom: {
    type: Array,
  },
};
export const ColumnEditingProps = {
  editEnabled: {
    type: Boolean,
    default() {
      return false;
    },
  },
};
export const WidgetProps = {
  columns: {
    type: Array,
  },
};
export const PickedProps = {
  columns: {
    type: Array,
    default() {
      return typeof WidgetProps.columns.default === "function"
        ? WidgetProps.columns.default()
        : WidgetProps.columns.default;
    },
  },
};
</script>
