<script>
const WidgetProps = {
  height: {
    type: Number,
    default() {
      return 10;
    },
  },
  data: {
    type: Object,
    default() {
      return { value: "" };
    },
  },
  info: {
    type: Object,
    default() {
      return { index: 0 };
    },
  },
};

export default WidgetProps;
</script>
