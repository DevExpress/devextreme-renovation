import React, { useState, useCallback } from 'react';
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

const App: React.FC = () => {
  const [lastClickedButton, setLastClickedButton] = useState("");
  const [toggle, setToggle] = useState(true);
  const [selectedItems, setSelectedItems] = useState(() => ['bold', 'strike']);

  const onClick = useCallback((e: any) => setLastClickedButton(`${e.type} - ${e.text}`), []);
  const toggleChange = useCallback((value: boolean) => setToggle(value), []);
  const buttonsSelected = useCallback((value: Array<string>) => setSelectedItems(value), []);

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
                width="120px"
                text="Contained"
                hint="Contained"
                type="normal"
                stylingMode="contained"
                
              />
            </div>
            <div>
              <Button
                width="120px"
                text="Outlined"
                hint="Outlined"
                type="normal"
                stylingMode="outlined"
                onClick={onClick}
              />
            </div>
            <div>
              <Button
                width="120px"
                text="Text"
                hint="Text"
                type="normal"
                stylingMode="text"
                onClick={onClick}
              />
            </div>
          </div>
          <div className="buttons-column">
            <div className="column-header">
              Success
              </div>
            <div>
              <Button
                width="120px"
                text="Contained"
                hint="Contained"
                type="success"
                stylingMode="contained"
                onClick={onClick}
              />
            </div>
            <div>
              <Button
                width="120px"
                text="Outlined"
                hint="Outlined"
                type="success"
                stylingMode="outlined"
                onClick={onClick}
              />
            </div>
            <div>
              <Button
                width="120px"
                text="Text"
                hint="Text"
                type="success"
                stylingMode="text"
                onClick={onClick}
              />
            </div>
          </div>
          <div className="buttons-column">
            <div className="column-header">
              Default
              </div>
            <div>
              <Button
                width="120px"
                text="Contained"
                hint="Contained"
                type="default"
                stylingMode="contained"
                onClick={onClick}
              />
            </div>
            <div>
              <Button
                width="120px"
                text="Outlined"
                hint="Outlined"
                type="default"
                stylingMode="outlined"
                onClick={onClick}
              />
            </div>
            <div>
              <Button
                width="120px"
                text="Text"
                hint="Text"
                type="default"
                stylingMode="text"
                onClick={onClick}
              />
            </div>
          </div>
          <div className="buttons-column">
            <div className="column-header">
              Danger
              </div>
            <div>
              <Button
                width="120px"
                text="Contained"
                hint="Contained"
                type="danger"
                stylingMode="contained"
                onClick={onClick}
              />
            </div>
            <div>
              <Button
                width="120px"
                text="Outlined"
                hint="Outlined"
                type="danger"
                stylingMode="outlined"
                onClick={onClick}
              />
            </div>
            <div>
              <Button
                width="120px"
                text="Text"
                hint="Text"
                type="danger"
                stylingMode="text"
                onClick={onClick}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        {` Last clicked button - ${lastClickedButton}`}
      </div>
      <div className="buttons">
        <div>
          <div className="buttons-column">
            <div className="column-header">
              {`Normal ${toggle ? 'ON' : 'OFF'}`}
            </div>
            <div>
              <ToggleButton
                width="120px"
                text="Outlined"
                hint="Outlined"
                type="normal"
                stylingMode="outlined"
                pressed={toggle}
                pressedChange={toggleChange}
              />
            </div>
          </div>
          <div className="buttons-column">
            <div className="column-header">
              {`Success ${toggle ? 'ON' : 'OFF'}`}
            </div>
            <div>
              <ToggleButton
                width="120px"
                text="Outlined"
                hint="Outlined"
                type="success"
                stylingMode="outlined"
                pressed={toggle}
                pressedChange={toggleChange}
              />
            </div>
          </div>
          <div className="buttons-column">
            <div className="column-header">
              {`Default ${toggle ? 'ON' : 'OFF'}`}
            </div>
            <div>
              <ToggleButton
                width="120px"
                text="Outlined"
                hint="Outlined"
                type="default"
                stylingMode="outlined"
                pressed={toggle}
                pressedChange={toggleChange}
              />
            </div>
          </div>
          <div className="buttons-column">
            <div className="column-header">
              {`Danger ${toggle ? 'ON' : 'OFF'}`}
            </div>
            <div>
              <ToggleButton
                width="120px"
                text="Outlined"
                hint="Outlined"
                type="danger"
                stylingMode="outlined"
                pressed={toggle}
                pressedChange={toggleChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="buttonGroups">
        <ButtonGroup
          items={fontStyles}
          selectedItems={selectedItems}
          selectedItemsChange={buttonsSelected}
          selectionMode="multiple"
          stylingMode="outlined"
          keyExpr="style"
        />
        <ButtonGroup
          items={fontStyles}
          selectedItems={selectedItems}
          selectedItemsChange={buttonsSelected}
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

export default App;
