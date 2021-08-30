<script>
export const NestedProps = {
  field1: {
    type: Number,
  },
  fieldTemplate: {
    type: String,
    default() {
      return "fieldTemplate";
    },
  },
  field3: {
    type: Number,
  },
};
export const BaseProps = {
  __defaultNestedValues: {
    default() {
      return { nestedProp: {} };
    },
  },
};
export const SomeProps = {
  fieldTemplate: {
    type: String,
    default() {
      return "fieldTemplate";
    },
  },
  __defaultNestedValues: {
    default() {
      return {
        nestedProp:
          typeof BaseProps.nestedProp.default === "function"
            ? BaseProps.nestedProp.default()
            : BaseProps.nestedProp.default,
      };
    },
  },
};
</script>
