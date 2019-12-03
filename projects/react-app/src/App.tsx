import React, { useState, useCallback } from 'react';
import Button from "./Button";
import ToggleButton from "./ToggleButton";
import ButtonGroup from "./ButtonGroup";
import Drawer from "./Drawer";
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
  const [drawerOpened, setDrawerOpened] = useState(false);

  const onClick = useCallback((e: any) => setLastClickedButton(`${e.type} - ${e.text}`), []);
  const toggleChange = useCallback((value: boolean) => setToggle(value), []);
  const buttonsSelected = useCallback((value: Array<string>) => setSelectedItems(value), []);

  const drawerHandleClick = useCallback(() => setDrawerOpened((value) => !value), []);
  const toggleDrawer = useCallback((value: boolean) => setDrawerOpened(value), []);

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
      <div className="drawer">
        <div className="drawer-toolbar">
          <Button
            onClick={drawerHandleClick}
            text={drawerOpened ? 'Close the drawer!' : 'Open the drawer!'}
            hint="Contained"
            type="normal"
            stylingMode="contained"
          />
        </div>
        <Drawer
          opened={drawerOpened}
          openedChange={toggleDrawer}
          hint="my drawer"
          width="800px"
          drawer={
            <div>
              <Button width="100%" text="Push me!" stylingMode="text" onClick={() => toggleDrawer(false)}/>
              <Button width="100%" text="Push me!" stylingMode="text" onClick={() => toggleDrawer(false)}/>
              <Button width="100%" text="Push me!" stylingMode="text" onClick={() => toggleDrawer(false)}/>
              <Button width="100%" text="Push me!" stylingMode="text" onClick={() => toggleDrawer(false)}/>
              <Button width="100%" text="Push me!" stylingMode="text" onClick={() => toggleDrawer(false)}/>
              <Button width="100%" text="Push me!" stylingMode="text" onClick={() => toggleDrawer(false)}/>
            </div>
          }>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Penatibus et magnis dis parturient. Eget dolor morbi non arcu risus. Tristique magna sit amet purus gravida quis blandit. Auctor urna nunc id cursus metus aliquam eleifend mi in. Tellus orci ac auctor augue mauris augue neque gravida. Nullam vehicula ipsum a arcu. Nullam ac tortor vitae purus faucibus ornare suspendisse sed nisi. Cursus in hac habitasse platea dictumst. Egestas dui id ornare arcu. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim.</p>
            <p>Mauris rhoncus aenean vel elit scelerisque mauris pellentesque pulvinar. Neque volutpat ac tincidunt vitae semper quis lectus. Sed sed risus pretium quam vulputate dignissim suspendisse in. Urna nec tincidunt praesent semper feugiat nibh sed pulvinar. Ultricies lacus sed turpis tincidunt id aliquet risus feugiat. Amet cursus sit amet dictum sit amet justo donec enim. Vestibulum rhoncus est pellentesque elit ullamcorper. Id aliquet risus feugiat in ante metus dictum at.</p>
        </Drawer>
      </div>
    </div>
  );
}

export default App;
