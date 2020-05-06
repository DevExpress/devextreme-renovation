<template>
  <div>
      <slot name="contentTemplate" v-bind:p1="'value'"></slot>
        <slot name="template"></slot>
      </div>
</template>

<script>
export const WidgetInput = {};

export default {
  props: WidgetInput,
  methods: {
    __restAttributes() {
      return {};
    }
  }
};
</script>
