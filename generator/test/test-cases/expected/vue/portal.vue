<template>
  <div
    ><DxPortal :container="() => document.body" v-if="rendered"
      ><span></span></DxPortal
    ><DxPortal
      :container="
        () =>
          (someRef?.() === undefined || someRef?.() === null
            ? undefined
            : someRef?.()) || null
      "
      ><span></span></DxPortal
  ></div>
</template>
<script>
import Vue from "vue";
export const WidgetProps = {
  someRef: {
    type: Function,
  },
};
const DxPortal = Vue.extend({
  render: function (createElement) {
    if (this.$attrs.container()) {
      return createElement(
        "div",
        {
          style: {
            display: "contents",
          },
        },
        this.$slots.default
      );
    }
    return null;
  },
  mounted: function () {
    this.$nextTick(this.__renderPortal);
  },
  updated: function () {
    this.$nextTick(this.__renderPortal);
  },
  methods: {
    __renderPortal() {
      const container = this.$attrs.container();
      if (container) {
        container.append(this.$el);
      }
    },
  },
});

export const DxWidget = {
  name: "Widget",
  components: {
    DxPortal,
  },
  props: WidgetProps,
  data() {
    return {
      rendered: false,
    };
  },
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { someRef: this.someRef?.() };
    },
  },
  methods: {
    __onInit() {
      this.rendered = true;
    },
  },
  created() {
    this.__destroyEffects = [];
    this.__scheduleEffects = [];
  },
  mounted() {
    this.__destroyEffects[0] = this.__onInit();
  },
  updated() {
    this.__scheduleEffects.forEach((_, i) => {
      this.__scheduleEffects[i] && this.__scheduleEffects[i]();
    });
  },
  beforeDestroy() {
    this.__destroyEffects.forEach((_, i) => {
      this.__destroyEffects[i] && this.__destroyEffects[i]();
    });
    this.__destroyEffects = null;
  },
};
export default DxWidget;
</script>
