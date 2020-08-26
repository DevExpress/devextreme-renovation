<script>
export const GridColumn = {
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
export const Custom = {};
export const AnotherCustom = {};
export const Editing = {
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
export const ColumnEditing = {
  editEnabled: {
    type: Boolean,
    default() {
      return false;
    },
  },
};
export const WidgetInput = {
  columns: {
    type: Array,
  },
};
export const PickedProps = {
  columns: {
    type: Array,
    default() {
      return typeof WidgetInput.columns.default === "function"
        ? WidgetInput.columns.default()
        : WidgetInput.columns.default;
    },
  },
};
</script>
