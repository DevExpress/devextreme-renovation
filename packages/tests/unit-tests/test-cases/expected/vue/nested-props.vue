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
  __defaultNestedValues: {
    default() {
      return { editing: EditingProps?.__defaultNestedValues.default() };
    },
  },
};
export const PickedProps = {
  columns: {
    type: Array,
  },
  __defaultNestedValues: {
    default() {
      return {
        editing:
          typeof WidgetProps.editing.default === "function"
            ? WidgetProps.editing.default()
            : WidgetProps.editing.default,
      };
    },
  },
};
</script>
