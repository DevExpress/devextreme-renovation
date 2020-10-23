<template>
  <div
    ><template v-for="item of items"
      ><div :key="item.key">{{ item.text }}</div></template
    ><template v-for="item of items"
      ><div :key="item.key"
        ><slot name="ListItem" v-bind:value="item.text">
          <div
            style="display: contents"
            :set="(ListItemDefault = { value: item.text })"
            ><WidgetWithProps :value="ListItemDefault.value"
          /></div> </slot></div></template
    ><template v-for="item of items"
      ><div style="display: contents" :key="item.key"
        ><slot name="ListItem" :value="item.text" @click="global_noop">
          <div
            style="display: contents"
            :set="
              (ListItemDefault = { value: item.text, onClick: global_noop })
            "
            ><WidgetWithProps
              :value="ListItemDefault.value"
              @click="ListItemDefault.onClick"
          /></div> </slot></div></template
  ></div>
</template>
<script>
import { DxWidgetWithProps as WidgetWithProps } from "./dx-widget-with-props";
const noop = (e) => {};
export const ListInput = {
  items: {
    type: Array,
  },
};
export const DxList = {
  components: {
    WidgetWithProps,
  },
  props: ListInput,
  data() {
    return {
      global_noop: noop,
    };
  },
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { items: this.items, ListItem: this.$scopedSlots.ListItem };
    },
  },
};
export default DxList;
</script>
