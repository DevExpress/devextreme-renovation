<template>
  <div ref="divRef">
    <WidgetWithRefProp
      :parentRef="() => this.$refs.divRef"
      :nullableRef="() => nullableRef()"
    />
  </div>
</template>
<script>
import WidgetWithRefProp from "./dx-widget-with-ref-prop";

const WidgetInput = {
  nullableRef: {
    type: Function,
  },
};

export default {
  components: {
    WidgetWithRefProp,
  },
  props: WidgetInput,
  computed: {
    __restAttributes() {
      return {};
    },
    props() {
      return { nullableRef: this.nullableRef() };
    },
  },
  methods: {
    __getSize() {
      return this.$refs.divRef.outerHTML + this.nullableRef()?.outerHTML;
    },
    __getNullable() {
      return this.nullableRef()?.outerHTML;
    },
  },
};
</script>
