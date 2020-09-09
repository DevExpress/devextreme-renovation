<template>
  <div
    ><template v-if="loading"
      ><div>{{ __loadingProps.text }}</div></template
    >
    <template v-else
      ><span>{{ "" + greetings + " " + __name + "" }}</span></template
    ></div
  >
</template>
<script>
export const WidgetInput = {
  loading: {
    type: Boolean,
    default() {
      return true;
    },
  },
  greetings: {
    type: String,
    default() {
      return "Hello";
    },
  },
};
export const DxWidget = {
  props: WidgetInput,
  computed: {
    __loadingProps() {
      return { text: "Loading..." };
    },
    __name() {
      return "User";
    },
    __restAttributes() {
      return {};
    },
    props() {
      return { loading: this.loading, greetings: this.greetings };
    },
  },
};
export default DxWidget;
</script>
