<template>
  <div
    ><template v-for="item of __items"
      ><div style="display: contents" :key="item.key" v-if="item !== null"
        ><slot
          name="ListItemTemplate"
          :color="item.color || 'red'"
          @click="item.onClick"
          :text="item.text"
          @ready="item.onReady"
        >
          <div
            style="display: contents"
            :set="
              (ListItemTemplateDefault = {
                color: item.color || 'red',
                onClick: item.onClick,
                text: item.text,
                onReady: item.onReady,
              })
            "
            ><ListItem
              :color="ListItemTemplateDefault.color"
              @click="ListItemTemplateDefault.onClick"
              :text="ListItemTemplateDefault.text"
              @ready="ListItemTemplateDefault.onReady"
          /></div> </slot
      ></div>
      <div v-else>empty</div></template
    ><template v-for="(item, index) of __items"
      ><div style="display: contents" :key="index"
        ><slot
          name="ListItemTemplate"
          :color="item.color || 'green'"
          @click="item.onClick"
          :text="item.text"
          @ready="item.onReady"
        >
          <div
            style="display: contents"
            :set="
              (ListItemTemplateDefault = {
                color: item.color || 'green',
                onClick: item.onClick,
                text: item.text,
                onReady: item.onReady,
              })
            "
            ><ListItem
              :color="ListItemTemplateDefault.color"
              @click="ListItemTemplateDefault.onClick"
              :text="ListItemTemplateDefault.text"
              @ready="ListItemTemplateDefault.onReady"
          /></div> </slot></div></template
    ><template v-for="{ color, key, onClick, onReady, text } of __items"
      ><div style="display: contents" :key="key"
        ><slot
          name="ListItemTemplate"
          :color="color || 'blue'"
          @click="onClick"
          :text="text"
          @ready="onReady"
        >
          <div
            style="display: contents"
            :set="
              (ListItemTemplateDefault = {
                color: color || 'blue',
                onClick: onClick,
                text: text,
                onReady: onReady,
              })
            "
            ><ListItem
              :color="ListItemTemplateDefault.color"
              @click="ListItemTemplateDefault.onClick"
              :text="ListItemTemplateDefault.text"
              @ready="ListItemTemplateDefault.onReady"
          /></div> </slot></div></template
    ><template v-for="{ key, text } of __items">{{
      `${key}: ${text} `
    }}</template
    ><span class="ready-counter">{{ counter }}</span></div
  >
</template>
<script>
import ListItem, { ListItemProps } from "./list-item";
export const ListProps = {
  items: {
    type: Array,
    default() {
      return [];
    },
  },
};
export const DxList = {
  components: {
    ListItem,
  },
  props: ListProps,
  data() {
    return {
      counter: 0,
    };
  },
  computed: {
    __items() {
      return this.items.map((item) => {
        return {
          ...item,
          onClick: () => {
            this.onClick(item.key);
          },
          onReady: () => {
            this.counter = this.counter + 1;
          },
        };
      });
    },
    __ListItemTemplate() {
      return this.$scopedSlots.ListItemTemplate;
    },
    __restAttributes() {
      return {};
    },
    props() {
      return {
        items: this.items,
        ListItemTemplate: this.$scopedSlots.ListItemTemplate,
        onClick: this.onClick,
      };
    },
  },
  methods: {
    __style(color) {
      return {
        backgroundColor: color,
        margin: 2,
        fontSize: 18,
        display: "inline-block",
        color: "white",
      };
    },
    onClick(...args) {
      this.$emit("click", ...args);
    },
  },
};
export default DxList;
</script>
