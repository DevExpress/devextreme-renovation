<template>
  <div style="display: contents;">
    <component :text="firstText" :is="mode ? 'WidgetOne' : 'WidgetTwo'">
      <div>Slot content</div>
    </component>

    <WidgetOne :text="secondText">
      <div>Children go here</div>
    </WidgetOne>

    <component
      text="self closing by condition"
      :is="mode ? 'WidgetOne' : 'WidgetTwo'"
    ></component>

    <WidgetTwo text="self closing" />

    <component
      :text="secondText"
      :is="mode ? 'WidgetOne' : 'WidgetTwo'"
    ></component>
  </div>
</template>
<script>
import WidgetOne from "./component-pass-one";
import WidgetTwo from "./component-pass-two";

export const WidgetProps = {
  mode: {
    type: Boolean,
    default() {
      return false;
    },
  },
  firstText: {
    type: String,
  },
  secondText: {
    type: String,
  },
};
export const DxWidget = {
  components: {
    WidgetOne,
    WidgetTwo,
  },
  props: WidgetProps,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return {
        mode: this.mode,
        firstText: this.firstText,
        secondText: this.secondText,
      };
    },
  },
};
export default DxWidget;
</script>
