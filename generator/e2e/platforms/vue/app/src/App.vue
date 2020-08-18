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
    <Nested
      :rows="[
        { cells: [{ gridData: 'cell11' }, 'cell12'] },
        { cells: ['cell21', 'cell22'] },
      ]"
    ></Nested>
    <Nested>
      <DxRow :cells="['cell31', { gridData: 'cell32' }]"></DxRow>
    </Nested>
    <Nested>
      <DxRow>
        <DxCell grid-data="cell41"></DxCell>
        <DxCell grid-data="cell42"></DxCell>
      </DxRow>
    </Nested>
    <Nested> </Nested>
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
