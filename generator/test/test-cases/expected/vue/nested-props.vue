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
    default: undefined,
  },
  defaultIndex: {
    type: Number,
    default() {
      return 0;
    },
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
    default() {
      return [];
    },
  },
};

export const WidgetInput = {
  columns: {
    type: Array,
  },
};
</script>
