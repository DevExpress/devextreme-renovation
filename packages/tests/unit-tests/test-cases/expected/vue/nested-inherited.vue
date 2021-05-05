<script>
export const FakeNested = {
  baseProp: {
    type: Number,
    default() {
      return 0;
    },
  },
};
export const WidgetProps = {
  baseProp: {
    type: Number,
    default() {
      return 0;
    },
  },
  __defaultNestedValues: {
    default() {
      return {
        someProp: {
          baseProp:
            FakeNested === undefined || FakeNested === null
              ? undefined
              : FakeNested.baseProp?.default(),
        },
      };
    },
  },
};
export const TooltipProps = {
  tooltipValue: {
    type: Number,
    default() {
      return 0;
    },
  },
  tooltipNested: {
    type: Array,
  },
  __defaultNestedValues: {
    default() {
      return { tooltipNested: [WidgetProps?.__defaultNestedValues.default()] };
    },
  },
};
export const BulletProps = {
  ...WidgetProps,
  value: {
    type: Number,
    default() {
      return 0;
    },
  },
  __defaultNestedValues: {
    default() {
      return {
        tooltip: TooltipProps?.__defaultNestedValues.default(),
        someProp:
          WidgetProps === undefined || WidgetProps === null
            ? undefined
            : WidgetProps.__defaultNestedValues?.default().someProp,
      };
    },
  },
};
</script>
