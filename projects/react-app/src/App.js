import React from 'react';
import Button from "./Button";
import ToggleButton from "./ToggleButton";
import ButtonGroup from "./ButtonGroup";
import './App.css';

const fontStyles = [{
    text: 'B',
    style: 'bold',
    hint: 'Bold',
    type: 'success'
  }, {
    text: 'I',
    style: 'italic',
    hint: 'Italic',
    type: 'success'
  }, {
    text: 'U',
    style: 'underline',
    hint: 'Underlined',
    type: 'success'
  }, {
    text: 'S',
    style: 'strike',
    hint: 'Strikethrough',
    type: 'success'
  }
];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lastClickedButton: "",
      toggle: true,
      selectedItems: ['bold', 'strike']
    };

    this.onClick = this.onClick.bind(this);
    this.toggleChange = this.toggleChange.bind(this);
    this.buttonsSelected = this.buttonsSelected.bind(this);
  }

  onClick(e) {
    this.setState({
      lastClickedButton: `${e.type} - ${e.text}`
    });
  }

  toggleChange(toggle) {
    this.setState({
      toggle
    });
  }

  buttonsSelected(value) {
    this.setState({
      selectedItems: value
    })
  }

  render() {
    return (
      <div>
        <div className="buttons">
          <div>
            <div className="buttons-column">
              <div className="column-header">
                Normal
              </div>
              <div>
                <Button
                  width={120}
                  text="Contained"
                  hint="Contained"
                  type="normal"
                  stylingMode="contained"
                  onClick={this.onClick}
                />
              </div>
              <div>
                <Button
                  width={120}
                  text="Outlined"
                  hint="Outlined"
                  type="normal"
                  stylingMode="outlined"
                  onClick={this.onClick}
                />
              </div>
              <div>
                <Button
                  width={120}
                  text="Text"
                  hint="Text"
                  type="normal"
                  stylingMode="text"
                  onClick={this.onClick}
                />
              </div>
            </div>
            <div className="buttons-column">
              <div className="column-header">
                Success
              </div>
              <div>
                <Button
                  width={120}
                  text="Contained"
                  hint="Contained"
                  type="success"
                  stylingMode="contained"
                  onClick={this.onClick}
                />
              </div>
              <div>
                <Button
                  width={120}
                  text="Outlined"
                  hint="Outlined"
                  type="success"
                  stylingMode="outlined"
                  onClick={this.onClick}
                />
              </div>
              <div>
                <Button
                  width={120}
                  text="Text"
                  hint="Text"
                  type="success"
                  stylingMode="text"
                  onClick={this.onClick}
                />
              </div>
            </div>
            <div className="buttons-column">
              <div className="column-header">
                Default
              </div>
              <div>
                <Button
                  width={120}
                  text="Contained"
                  hint="Contained"
                  type="default"
                  stylingMode="contained"
                  onClick={this.onClick}
                />
              </div>
              <div>
                <Button
                  width={120}
                  text="Outlined"
                  hint="Outlined"
                  type="default"
                  stylingMode="outlined"
                  onClick={this.onClick}
                />
              </div>
              <div>
                <Button
                  width={120}
                  text="Text"
                  hint="Text"
                  type="default"
                  stylingMode="text"
                  onClick={this.onClick}
                />
              </div>
            </div>
            <div className="buttons-column">
              <div className="column-header">
                Danger
              </div>
              <div>
                <Button
                  width={120}
                  text="Contained"
                  hint="Contained"
                  type="danger"
                  stylingMode="contained"
                  onClick={this.onClick}
                />
              </div>
              <div>
                <Button
                  width={120}
                  text="Outlined"
                  hint="Outlined"
                  type="danger"
                  stylingMode="outlined"
                  onClick={this.onClick}
                />
              </div>
              <div>
                <Button
                  width={120}
                  text="Text"
                  hint="Text"
                  type="danger"
                  stylingMode="text"
                  onClick={this.onClick}
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          {` Last clicked button - ${this.state.lastClickedButton}`}
        </div>
        <div className="buttons">
          <div>
            <div className="buttons-column">
              <div className="column-header">
                {`Normal ${this.state.toggle ? 'ON' : 'OFF'}`}
              </div>
              <div>
                <ToggleButton
                  width={120}
                  text="Outlined"
                  hint="Outlined"
                  type="normal"
                  stylingMode="outlined"
                  pressed={this.state.toggle}
                  pressedChange={this.toggleChange}
                />
              </div>
            </div>
            <div className="buttons-column">
              <div className="column-header">
                {`Success ${this.state.toggle ? 'ON' : 'OFF'}`}
              </div>
              <div>
                <ToggleButton
                  width={120}
                  text="Outlined"
                  hint="Outlined"
                  type="success"
                  stylingMode="outlined"
                  pressed={this.state.toggle}
                  pressedChange={this.toggleChange}
                />
              </div>
            </div>
            <div className="buttons-column">
              <div className="column-header">
                {`Default ${this.state.toggle ? 'ON' : 'OFF'}`}
              </div>
              <div>
                <ToggleButton
                  width={120}
                  text="Outlined"
                  hint="Outlined"
                  type="default"
                  stylingMode="outlined"
                  pressed={this.state.toggle}
                  pressedChange={this.toggleChange}
                />
              </div>
            </div>
            <div className="buttons-column">
              <div className="column-header">
                {`Danger ${this.state.toggle ? 'ON' : 'OFF'}`}
              </div>
              <div>
                <ToggleButton
                  width={120}
                  text="Outlined"
                  hint="Outlined"
                  type="danger"
                  stylingMode="outlined"
                  pressed={this.state.toggle}
                  pressedChange={this.toggleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="buttonGroups">
          <ButtonGroup
            items={fontStyles}
            selectedItems={this.state.selectedItems}
            selectedItemsChange={this.buttonsSelected}
            selectionMode="multiple"
            stylingMode="outlined"
            keyExpr="style"
          />
          <ButtonGroup
            items={fontStyles}
            selectedItems={this.state.selectedItems}
            selectedItemsChange={this.buttonsSelected}
            selectionMode="multiple"
            stylingMode="contained"
            keyExpr="style"
          />
          <ButtonGroup
            items={fontStyles}
            selectionMode="single"
            stylingMode="text"
            defaultSelectedItems={['bold', 'strike']}
            keyExpr="style"
          />
        </div>
      </div>
    );
  }
};

export default App;
