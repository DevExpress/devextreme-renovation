  <template>
  <div v-bind:style="__processStyle({
        width:100,
        height:100
    })"></div>
</template>
<script>
export const InnerWidgetProps = {
  selected: {
    type: Boolean
  },
  value: {
    type: Number,
    default: undefined
  }
};
export default {
  props: InnerWidgetProps,
  data() {
    return {
      value_state: undefined
    };
  },
  methods: {
    __restAttributes() {
      return {};
    },
    __processStyle(value) {
      if (typeof value === "object") {
        return Object.keys(value).reduce((v, k) => {
          if (typeof value[k] === "number") {
            v[k] = value[k] + "px";
          } else {
            v[k] = value[k];
          }
          return v;
        }, {});
      }
      return value;
    }
  }
};
</script>