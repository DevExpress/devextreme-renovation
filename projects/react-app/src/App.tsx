import React, { useState, useCallback, useRef } from 'react';
import Button from "./Button";
import ToggleButton from "./ToggleButton";
import ButtonGroup from "./ButtonGroup";
import Drawer from "./Drawer";
import List, { ListRef } from "./List";
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

const taskList = ['Prepare 2016 Financial', 'Prepare 2016 Marketing Plan', 'Update Personnel Files', 'Review Health Insurance Options Under the Affordable Care Act', 'New Brochures', '2016 Brochure Designs', 'Brochure Design Review', 'Website Re-Design Plan', 'Rollout of New Website and Marketing Brochures',
'Update Sales Strategy Documents', 'Create 2012 Sales Report', 'Direct vs Online Sales Comparison Report', 'Review 2012 Sales Report and Approve 2016 Plans', 'Deliver R&D Plans for 2016',
'Create 2016 R&D Plans', '2016 QA Strategy Report', '2016 Training Events', 'Approve Hiring of John Jeffers', 'Non-Compete Agreements', 'Update NDA Agreement', 'Update Employee Files with New NDA', 'Sign Updated NDA',
'Submit Questions Regarding New NDA', 'Submit Signed NDA', 'Update Revenue Projections', 'Review Revenue Projections', 'Comment on Revenue Projections', 'Provide New Health Insurance Docs',
'Review Changes to Health Insurance Coverage', 'Scan Health Insurance Forms', 'Sign Health Insurance Forms', 'Follow up with West Coast Stores', 'Follow up with East Coast Stores',
'Send Email to Customers about Recall', 'Submit Refund Report for 2016 Recall', 'Give Final Approval for Refunds', 'Prepare Product Recall Report', 'Review Product Recall Report by Engineering Team',
'Create Training Course for New TVs', 'Review Training Course for any Ommissions', 'Review Overtime Report', 'Submit Overtime Request Forms', 'Overtime Approval Guidelines', 'Refund Request Template',
'Recall Rebate Form', 'Create Report on Customer Feedback', 'Review Customer Feedback Report', 'Customer Feedback Report Analysis', 'Prepare Shipping Cost Analysis Report', 'Provide Feedback on Shippers',
'Select Preferred Shipper', 'Complete Shipper Selection Form', 'Upgrade Server Hardware', 'Upgrade Personal Computers', 'Approve Personal Computer Upgrade Plan', 'Decide on Mobile Devices to Use in the Field',
'Upgrade Apps to Windows RT or stay with WinForms', 'Estimate Time Required to Touch-Enable Apps', 'Report on Tranistion to Touch-Based Apps', 'Try New Touch-Enabled WinForms Apps',
'Rollout New Touch-Enabled WinForms Apps', 'Site Up-Time Report', 'Review Site Up-Time Report', 'Review Online Sales Report', 'Determine New Online Marketing Strategy', 'New Online Marketing Strategy',
'Approve New Online Marketing Strategy', 'Submit New Website Design', 'Create Icons for Website', 'Review PSDs for New Website', 'Create New Shopping Cart', 'Create New Product Pages', 'Review New Product Pages',
'Approve Website Launch', 'Launch New Website', 'Update Customer Shipping Profiles', 'Create New Shipping Return Labels', 'Get Design for Shipping Return Labels', 'PSD needed for Shipping Return Labels',
'Request Bandwidth Increase from ISP', 'Submit D&B Number to ISP for Credit Approval', 'Contact ISP and Discuss Payment Options', 'Prepare Year-End Support Summary Report', 'Analyze Support Traffic for 2016',
'Review New Training Material', 'Distribute Training Material to Support Staff', 'Training Material Distribution Schedule', 'Provide New Artwork to Support Team', 'Publish New Art on the Server',
'Replace Old Artwork with New Artwork', 'Ship New Brochures to Field', 'Ship Brochures to Todd Hoffman', 'Update Server with Service Packs', 'Install New Database', 'Approve Overtime for HR',
'Review New HDMI Specification', 'Approval on Converting to New HDMI Specification', 'Create New Spike for Automation Server', 'Report on Retail Sales Strategy for 2014', 'Code Review - New Automation Server',
'Feedback on New Training Course', 'Send Monthly Invoices from Shippers', 'Schedule Meeting with Sales Team', 'Confirm Availability for Sales Meeting', 'Reschedule Sales Team Meeting', 'Send 2 Remotes for Giveaways',
'Ship 2 Remotes Priority to Clark Morgan', 'Discuss Product Giveaways with Management', 'Follow Up Email with Recent Online Purchasers', 'Replace Desktops on the 3rd Floor', 'Update Database with New Leads',
'Mail New Leads for Follow Up', 'Send Territory Sales Breakdown', 'Territory Sales Breakdown Report', 'Return Merchandise Report', 'Report on the State of Engineering Dept', 'Staff Productivity Report',
'Review HR Budget Company Wide', 'Sales Dept Budget Request Report', 'Support Dept Budget Report', 'IT Dept Budget Request Report', 'Engineering Dept Budget Request Report', '1Q Travel Spend Report',
'Approve Benefits Upgrade Package', 'Final Budget Review', 'State of Operations Report', 'Online Sales Report', 'Reprint All Shipping Labels', 'Shipping Label Artwork', 'Specs for New Shipping Label',
'Move Packaging Materials to New Warehouse', 'Move Inventory to New Warehouse', 'Take Forklift to Service Center', 'Approve Rental of Forklift', 'Give Final Approval to Rent Forklift', 'Approve Overtime Pay',
'Approve Vacation Request', 'Approve Salary Increase Request', 'Review Complaint Reports', 'Review Website Complaint Reports', 'Test New Automation App', 'Fix Synchronization Issues', 'Free Up Space for New Application Set',
'Install New Router in Dev Room', 'Update Your Profile on Website', 'Schedule Conf Call with SuperMart', 'Support Team Evaluation Report', 'Create New Installer for Company Wide App Deployment',
'Pickup Packages from the Warehouse', 'Sumit Travel Expenses for Recent Trip', 'Make Travel Arrangements for Sales Trip to San Francisco', 'Book Flights to San Fran for Sales Trip',
'Collect Customer Reviews for Website', 'Submit New W4 for Updated Exemptions', 'Get New Frequent Flier Account', 'Review New Customer Follow Up Plan', 'Submit Customer Follow Up Plan Feedback',
'Review Issue Report and Provide Workarounds', 'Contact Customers for Video Interviews', 'Resubmit Request for Expense Reimbursement', 'Approve Vacation Request Form', 'Email Test Report on New Products',
'Send Receipts for all Flights Last Month'].map(item => ({ value: item }));
//https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/
const products = [{
  'ID': 1,
  'Name': 'HD Video Player',
  'Price': 330,
  'Current_Inventory': 225,
  'Backorder': 0,
  'Manufacturing': 10,
  'Category': 'Video Players',
  'ImageSrc': 'images/products/1.png'
}, {
  'ID': 3,
  'Name': 'SuperPlasma 50',
  'Price': 2400,
  'Current_Inventory': 0,
  'Backorder': 0,
  'Manufacturing': 0,
  'Category': 'Televisions',
  'ImageSrc': 'images/products/3.png'
}, {
  'ID': 4,
  'Name': 'SuperLED 50',
  'Price': 1600,
  'Current_Inventory': 77,
  'Backorder': 0,
  'Manufacturing': 55,
  'Category': 'Televisions',
  'ImageSrc': 'images/products/4.png'
}, {
  'ID': 5,
  'Name': 'SuperLED 42',
  'Price': 1450,
  'Current_Inventory': 445,
  'Backorder': 0,
  'Manufacturing': 0,
  'Category': 'Televisions',
  'ImageSrc': 'images/products/5.png'
}, {
  'ID': 6,
  'Name': 'SuperLCD 55',
  'Price': 1350,
  'Current_Inventory': 345,
  'Backorder': 0,
  'Manufacturing': 5,
  'Category': 'Televisions',
  'ImageSrc': 'images/products/6.png'
}, {
  'ID': 7,
  'Name': 'SuperLCD 42',
  'Price': 1200,
  'Current_Inventory': 210,
  'Backorder': 0,
  'Manufacturing': 20,
  'Category': 'Televisions',
  'ImageSrc': 'images/products/7.png'
}, {
  'ID': 8,
  'Name': 'SuperPlasma 65',
  'Price': 3500,
  'Current_Inventory': 0,
  'Backorder': 0,
  'Manufacturing': 0,
  'Category': 'Televisions',
  'ImageSrc': 'images/products/8.png'
}, {
  'ID': 9,
  'Name': 'SuperLCD 70',
  'Price': 4000,
  'Current_Inventory': 95,
  'Backorder': 0,
  'Manufacturing': 5,
  'Category': 'Televisions',
  'ImageSrc': 'images/products/9.png'
}, {
  'ID': 10,
  'Name': 'DesktopLED 21',
  'Price': 175,
  'Current_Inventory': null,
  'Backorder': 425,
  'Manufacturing': 75,
  'Category': 'Monitors',
  'ImageSrc': 'images/products/10.png'
}, {
  'ID': 12,
  'Name': 'DesktopLCD 21',
  'Price': 170,
  'Current_Inventory': 210,
  'Backorder': 0,
  'Manufacturing': 60,
  'Category': 'Monitors',
  'ImageSrc': 'images/products/12.png'
}, {
  'ID': 13,
  'Name': 'DesktopLCD 19',
  'Price': 160,
  'Current_Inventory': 150,
  'Backorder': 0,
  'Manufacturing': 210,
  'Category': 'Monitors',
  'ImageSrc': 'images/products/13.png'
}, {
  'ID': 14,
  'Name': 'Projector Plus',
  'Price': 550,
  'Current_Inventory': null,
  'Backorder': 55,
  'Manufacturing': 10,
  'Category': 'Projectors',
  'ImageSrc': 'images/products/14.png'
}, {
  'ID': 15,
  'Name': 'Projector PlusHD',
  'Price': 750,
  'Current_Inventory': 110,
  'Backorder': 0,
  'Manufacturing': 90,
  'Category': 'Projectors',
  'ImageSrc': 'images/products/15.png'
}, {
  'ID': 17,
  'Name': 'ExcelRemote IR',
  'Price': 150,
  'Current_Inventory': 650,
  'Backorder': 0,
  'Manufacturing': 190,
  'Category': 'Automation',
  'ImageSrc': 'images/products/17.png'
}, {
  'ID': 18,
  'Name': 'ExcelRemote BT',
  'Price': 180,
  'Current_Inventory': 310,
  'Backorder': 0,
  'Manufacturing': 0,
  'Category': 'Automation',
  'ImageSrc': 'images/products/18.png'
}, {
  'ID': 19,
  'Name': 'ExcelRemote IP',
  'Price': 200,
  'Current_Inventory': 0,
  'Backorder': 325,
  'Manufacturing': 225,
  'Category': 'Automation',
  'ImageSrc': 'images/products/19.png'
}];

const productRender = function(item: any) {
  return (
    <div className="product">
      <img src={`https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/${item.ImageSrc}`} />
      <div>{item.Name}</div>
      <div className="price">${item.Price}</div>
    </div>
  );
}

const App: React.FC = () => {
  const [lastClickedButton, setLastClickedButton] = useState("");
  const [toggle, setToggle] = useState(true);
  const [selectedItems, setSelectedItems] = useState(() => ['bold', 'strike']);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [selectedListItems, setSelectedListItems] = useState(() => [] as any[]);
  const [elementAttr, setElementAttr] = useState(() => ({ id: "Button_1", "data_my_data": "this is my button" } as any));

  const onClick = useCallback((e: any) => setLastClickedButton(`${e.type} - ${e.text}`), []);
  const changeElementAttr = useCallback(() => {
    if(elementAttr.data_my_other_data) {
      setElementAttr({...elementAttr, data_my_other_data: ""});
    } else {
      setElementAttr({...elementAttr, data_my_other_data: "yes"});
    }
  }, [elementAttr]);

  const toggleChange = useCallback((value: boolean) => setToggle(value), []);
  const buttonsSelected = useCallback((value: string[]) => setSelectedItems(value), []);

  const drawerHandleClick = useCallback(() => setDrawerOpened((value) => !value), []);
  const toggleDrawer = useCallback((value: boolean) => setDrawerOpened(value), []);

  const list_ref = useRef<ListRef>(null);

  return (
    <div>
      <div className="demo-case buttons">
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
                elementAttr={elementAttr}
              />
            </div>
            <div>
              <Button
                width="120px"
                text="Outlined"
                hint="Outlined"
                type="normal"
                stylingMode="outlined"
                onClick={changeElementAttr}
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
          <div className="buttons-column">
            <div className="column-header">
              Default options
              </div>
            <div>
              <Button
                width="120px"
                onClick={onClick}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="demo-case">
        {` Last clicked button - ${lastClickedButton}`}
      </div>
      <div className="demo-case buttons">
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
                // pressed={toggle}
                // pressedChange={toggleChange}
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
          <div className="buttons-column">
            <div className="column-header">
              Default options
            </div>
            <div>
              <ToggleButton
                width="120px"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="demo-case buttonGroups">
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
      <div className="demo-case drawer">
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
      <div className="demo-case lists">
        <div>
          <div className="lists-column">
            <Button
              onClick={() => {
                list_ref.current!.export()
              }}
              text="Export"
              hint="Contained"
              type="normal"
              stylingMode="contained"
            />
            <List
              ref={list_ref}
              width="400px"
              height="300px"
              items={taskList}
              selectedItems={selectedListItems}
              selectedItemsChange={setSelectedListItems}
            />
          </div>
          <div className="lists-column">
            <List
              width="400px"
              height="300px"
              items={taskList}
              selectedItems={selectedListItems}
              selectedItemsChange={setSelectedListItems}
            />
          </div>
          <div className="lists-column">
            <List
              width="400px"
              height="300px"
              items={products}
              keyExpr="ID"
              displayExpr="Name"
              itemRender={productRender}
              selectedItems={selectedListItems}
              selectedItemsChange={setSelectedListItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
