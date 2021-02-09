<template>
  <div>
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
        <DxRowCell grid-data="cell41"></DxRowCell>
        <DxRowCell grid-data="cell42"></DxRowCell>
      </DxRow>
    </Nested>
    <Nested>
      <DxRow>
        <DxRowCell></DxRowCell>
        <DxRowCell grid-data="notDefault"></DxRowCell>
      </DxRow>
    </Nested>
    <Nested :rows="[]"> </Nested>
    <Nested> </Nested>
  </div>
</template>
<script>
import ButtonWithTemplate from "../../../../../components/button-with-template.tsx";
import Counter from "../../../../../components/counter.tsx";
import Nested, { DxRow, DxRowCell } from "../../../../../components/nested.tsx";

export default {
  components: {
    ButtonWithTemplate,
    Counter,
    Nested,
    DxRow,
    DxRowCell,
  },

  data() {
    return {
      counterValue: 15,
    };
  },
  methods: {},
};
</script>
