import { Component, createRef, forwardRef } from "inferno";
import { ConfigProvider } from '../transpiled-renovation-npm/renovation/common/config_provider';

import {Button as ButtonClass} from "../transpiled-renovation-npm/renovation/ui/button"
import InfernoButtonFR, {Button} from "./testing-button/button"

import { initDevTools } from 'inferno-devtools';
const buttonTemplate = ({ text }) => (
  <div style={{ border: "1px solid blue" }}>{text + "!"}</div>
);

import { HookComponent, useState, useRef, useContext, useEffect, useCallback, useImperativeHandle } from "@devextreme/runtime/inferno-hooks/hooks";
import { createContext } from "@devextreme/runtime/dist/esm/inferno-hooks/create_context";


initDevTools();

const Context1 = createContext("Context1");

class ClassTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
      deepValue: 1
    };
    this.ref1 = createRef();
    this.ref2 = createRef();
  
  }
  shouldComponentUpdate() {
    return this.state.value != 5 || this.state.deepValue != 5;
  }
  componentDidMount() {
    if(this.state.value < 5) {
      this.setState((state) => ({ ...state, value: state.value + 1}));
    }
    if(this.state.deepValue != this.state.value) {
      this.setState((state) => ({...state, deepValue: state.value }));
    }
  }
  componentDidUpdate() {
    if(this.state.value < 5) {
      this.setState((state) => ({state, value: state.value + 1}));
    }
    if(this.state.deepValue != this.state.value) {
      this.setState((state) => ({state, deepValue: state.value}));
    }
  }
  render() {
    const text = `Hooks + ${this.state.value}`;
    const conteext1Value = this.context[0];
    return <div ref={this.ref1} /*onclick={() => { this.setState(state + 1) }}*/>
      {text}
      <div>{this.state.deepValue}</div>
      <div ref={this.ref2}>{conteext1Value}</div>
    </div>
  }
}


function Test(props, ref) {
  return <HookComponent renderFn={
    () => {
      const [state, setState] = useState(1);
      const [depState, setDepState] = useState(1);
      const text = `Hooks + ${state}`;
      const ref1 = useRef();
      const ref2 = useRef();
      const conteext1Value = useContext(Context1);
      useEffect(() => {
        if(state < 5) {
          setState(state + 1);
        }
      }, state, depState)
      const onClick = useCallback(() => { setState(state + 1) ; console.log('1', state)}, state)
      const onClick2 = useCallback(() => { console.log('2', conteext1Value + state) }, conteext1Value)
      useEffect(() => {
        setDepState(state)
      }, state, depState)
      useImperativeHandle(ref, ()=> ({
        testMethod: () => { console.log('UseImp', conteext1Value + state) }
      }), state);
      return <div ref={ref1} onClick={onClick}>
        {text}
        <div>{depState}</div>
        <div ref={ref2} onClick={onClick2}>{conteext1Value}</div>
      </div>

    }
  } childProps={props}/>
}
const TestWrapper = forwardRef(Test);

const log123 = ()=>{console.log("123")}

const ButtonTemplate = (props)=>{
  return <div>
    I am Button Template
    <div class='cildren'>{props.children}</div>
    </div>
}
export default class NativeComponents extends Component {
  constructor(props) {
    super(props);
    this.click1 = () => { console.log("234") };
    this.click2 = () => { console.log("123") };
    this.state = {
      counterValue: 15,
      buttonChildren: null,
      visible: true,
      disabled: false,
      rtlEnabled: false,
      onButtonClick: this.click1
    };
    this.counterValueChange = this.counterValueChange.bind(this);
    this.setButtonChildren = this.setButtonChildren.bind(this);
    this.setButtonTemplate = this.setButtonTemplate.bind(this);
    this.setVisible = this.setVisible.bind(this);
    this.setDisabled = this.setDisabled.bind(this);
    this.setOnClick = this.setOnClick.bind(this);
    this.setRtl = this.setRtl.bind(this);
    this.setEnable = this.setEnable.bind(this);
    this.testCount = 0;
    this.testCount1 = 0;
    this.avg_time = 0;
    this.disp_time = 0;
  }

  counterValueChange(e) {
    this.setState({
      counterValue: e,
    });
  }
  
  setButtonChildren() {
    this.perf_test(()=>{
      console.time("setChildren");
      this.setState({
        ...this.state,
        buttonChildren: this.state.buttonChildren ? null : (<div>ButtonChild</div>),
      })
      console.timeEnd("setChildren");
      
    })
    
  }

  setButtonTemplate() {
    this.perf_test(()=>{
      console.time("setTemplate");
      this.setState({
        buttonTemplate: this.state.buttonTemplate ? null : ButtonTemplate
      })
      console.timeEnd("setTemplate");
    })
    
  }

  setVisible() {
    this.perf_test(()=>{
      console.time("setVisible")
      this.setState({ visible: !this.state.visible })
      console.timeEnd("setVisible")
    })
    
  }
  setDisabled () {
    this.perf_test(()=>{
      console.time("setDisabled")
      this.setState({ disabled: !this.state.disabled })
      console.timeEnd("setDisabled")
    })
    
  }

  setOnClick() {
    this.perf_test(()=>{
      console.time("setOnClick")
      this.setState({ onButtonClick: this.state.onButtonClick === this.click1 ? this.click2 : this.click1 })
      console.timeEnd("setOnClick")
    })
    
  }
  perf_test(t) {
    const startDate = Date.now();
    t();
    const time = Date.now() - startDate;
    if(this.testCount1 < 10) { this.testCount1++; return; }
    const avg_time = ((this.testCount / (this.testCount + 1)) * this.avg_time) + time / (this.testCount + 1);
    this.disp_time = (this.testCount / (this.testCount + 1)) * (this.disp_time + this.avg_time * this.avg_time) + ((time * time) / (this.testCount + 1)) - avg_time * avg_time;
    this.avg_time = avg_time;
    this.testCount++;
    console.log(this.avg_time, this.disp_time, this.testCount);
  }
  setRtl() {
    this.perf_test(() => {
      console.time("setRtl")
      this.setState({rtlEnabled: !this.state.rtlEnabled})
      console.timeEnd("setRtl")
    })
  }

  setEnable() {
    this.perf_test(()=>{
      console.time("Conditional Rendering")
      this.setState({enable: !this.state.enable})
      this.setState({enable: !this.state.enable})
      console.timeEnd("Conditional Rendering")
    })
  }
  render() {
    const ref = createRef()
    const widgetRef = createRef()
    const classRef = createRef()
    const array10000 = [...Array(1000)]
    const ref10000 = [array10000].map((value)=>createRef())
    return (
      <div>
        <button onclick={this.setButtonChildren}>Set Button Children</button>
        <button onclick={this.setButtonTemplate}>Set Button Template</button>
        <button onclick={this.setVisible}>Set visible</button>
        <button onclick={this.setDisabled}>Change Disabled</button>
        <button onclick={this.setEnable}>Conditional Rendering</button>
        <button onclick={this.setOnClick}>Change Event</button>
        <button onclick={this.setRtl}>Set RTL</button>
        
        <ConfigProvider rtlEnabled={this.state.rtlEnabled}>
          {/* { array10000.map(()=><ButtonClass  {...Button.defaultProps}>InfernoButton</ButtonClass>)} */}
          { array10000.map(()=><ButtonClass  {...Button.defaultProps} >{this.state.buttonChildren || "InfernoButton"}</ButtonClass>)}
          {/* { array10000.map(()=><ButtonClass  {...Button.defaultProps} template={this.state.buttonTemplate}>Inferno Button</ButtonClass>)} */}
          {/* {array10000.map((value, index)=>{return <ButtonClass ref={ref10000[index]}{...Button.defaultProps} >InfernoButton</ButtonClass>})} */}
          {/* {array10000.map((value, index)=>{return <ButtonClass  {...Button.defaultProps} visible={this.state.visible}>Inferno Button</ButtonClass>})} */}
          {/* {this.state.enable ?  array10000.map(()=><ButtonClass  {...Button.defaultProps}>InfernoButton</ButtonClass>) : null} */}
          {/* {array10000.map((value, index)=>{return <ButtonClass  {...Button.defaultProps} onClick={this.state.onButtonClick} disabled={this.state.visible}>Inferno Button</ButtonClass>})} */}
          {/* {this.state.enable ? array10000.map((value, index) => { return <ButtonClass  {...Button.defaultProps} onClick={this.state.onButtonClick} disabled={this.state.disabled}>Inferno Button</ButtonClass> }):null} */}

          {/* {array10000.map((value, index)=>{return <ButtonClass  {...Button.defaultProps}>Inferno Button</ButtonClass>})} */}
        </ConfigProvider>
      </div>
    );
  }
}
