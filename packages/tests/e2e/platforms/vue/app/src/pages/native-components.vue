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
    <Nested :rows="[]"> </Nested>
    <br />
    Default values:
    <div style="border: 1px solid">
      Just nested:
      <Nested></Nested>
      <br />
      Nested Row:
      <Nested>
        <DxRow></DxRow>
      </Nested>
      <br />
      Nested Row with not default Row:
      <Nested>
        <DxRow></DxRow>
        <DxRow :cells="[{ gridData: 'cell11' }, 'cell12']"></DxRow>
      </Nested>
      <br />
      Nested Cell:
      <Nested>
        <DxRow>
          <DxRowCell></DxRowCell>
        </DxRow>
      </Nested>
      <br />
      Nested Cell with not default Cell:
      <Nested>
        <DxRow>
          <DxRowCell />
          <DxRowCell gridData="notDefault" />
        </DxRow>
      </Nested>
    </div>
    hasOwnProperty tests<br/>
        All is not defined
        <UndefWidget/>
        All is defined by a prop
        <UndefWidget oneWayProp="2" twoWayProp="2" :nestedProp="[{numberProp: 2}]" 
          :someRef="someRef" :someForwardRef="someRef"
          :anotherNestedPropInit="[{numberProp: 2}]">
        </UndefWidget>
        Nested defined by a config component, OneWay and TwoWay set to undefined
        <UndefWidget :oneWayProp="undefined" :twoWayProp="undefined">
          <DxNestedProp numberProp="2"/>
        </UndefWidget>
  </div>
</template>
<script>
import ButtonWithTemplate from "../../../../../components/button-with-template.tsx";
import Counter from "../../../../../components/counter.tsx";
import Nested, { DxRow, DxRowCell } from "../../../../../components/nested.tsx";
import UndefWidget, {DxNestedProp} from "../../../../../components/nested-undefined-component.tsx";

export default {
  components: {
    ButtonWithTemplate,
    Counter,
    Nested,
    DxRow,
    DxRowCell,
    UndefWidget,
    DxNestedProp
  },

  data() {
    return {
      counterValue: 15,
      someRef: null
    };
  },
  methods: {},
};
</script>
