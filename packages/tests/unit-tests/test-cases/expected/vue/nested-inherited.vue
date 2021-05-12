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
export const BulletProps2 = {
  ...BulletProps,
  fakeNestedArr: {
    type: Array,
  },
  __defaultNestedValues: {
    default() {
      return {
        fakeNestedArr: [
          {
            baseProp:
              FakeNested === undefined || FakeNested === null
                ? undefined
                : FakeNested.baseProp?.default(),
          },
        ],
        tooltip:
          BulletProps === undefined || BulletProps === null
            ? undefined
            : BulletProps.__defaultNestedValues?.default().tooltip,
        someProp:
          BulletProps === undefined || BulletProps === null
            ? undefined
            : BulletProps.__defaultNestedValues?.default().someProp,
      };
    },
  },
};
export const BulletProps3 = {
  ...BulletProps2,
  fakeNestedArr2: {
    type: Array,
  },
  __defaultNestedValues: {
    default() {
      return {
        fakeNestedArr2: [
          {
            baseProp:
              FakeNested === undefined || FakeNested === null
                ? undefined
                : FakeNested.baseProp?.default(),
          },
        ],
        fakeNestedArr:
          BulletProps2 === undefined || BulletProps2 === null
            ? undefined
            : BulletProps2.__defaultNestedValues?.default().fakeNestedArr,
        tooltip:
          BulletProps2 === undefined || BulletProps2 === null
            ? undefined
            : BulletProps2.__defaultNestedValues?.default().tooltip,
        someProp:
          BulletProps2 === undefined || BulletProps2 === null
            ? undefined
            : BulletProps2.__defaultNestedValues?.default().someProp,
      };
    },
  },
};
</script>
