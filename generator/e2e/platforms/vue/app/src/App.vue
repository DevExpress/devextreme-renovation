<template>
  <div>
    <dx-app />

    <button-with-template text="With Template">
      <template #template="data">
        <div v-bind:style="{ border: '1px solid blue' }">
          {{ data.text + "!" }}
        </div>
      </template> </button-with-template
    ><button-with-template text="Without Template" />
    <form>
      <Counter id="counter-control" v-model="counterValue"></Counter>
    </form>
    <div id="counter-form-value">{{ counterValue }}</div>
    <Nested :cells="[{ data: 'cell11' }, 'cell12']"></Nested>
    <Nested><DxCell data="cell21" /><DxCell data="cell22" /></Nested>
  </div>
</template>
<script>
import DxApp from "../../../../components/app.tsx";
import ButtonWithTemplate from "../../../../components/button-with-template.tsx";
import Counter from "../../../../components/counter.tsx";
import Nested from "../../../../components/nested.tsx";

export default {
  components: {
    DxApp,
    ButtonWithTemplate,
    Counter,
    Nested,
  },

  data() {
    return {
      counterValue: 15,
    };
  },
  methods: {},
};
</script>
