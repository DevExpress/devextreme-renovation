<template>
  <div>
    <div class="demo-case buttons">
      <div>
        <div class="buttons-column">
          <div class="column-header">Normal</div>
          <div>
            <dx-button
              :element-attr="elementAttr"
              width="120px"
              text="Contained"
              hint="Contained"
              type="normal"
              styling-mode="contained"
            />
          </div>
          <div>
            <dx-button
              @on-click="changeElementAttr"
              width="120px"
              text="Outlined"
              hint="Outlined"
              type="normal"
              styling-mode="outlined"
            />
          </div>
          <div>
            <dx-button
              @on-click="onClick"
              width="120px"
              text="Text"
              hint="Text"
              type="normal"
              styling-mode="text"
            />
          </div>
        </div>
        <div class="buttons-column">
          <div class="column-header">Success</div>
          <div>
            <dx-button
              @on-click="onClick"
              width="120px"
              text="Contained"
              hint="Contained"
              type="success"
              styling-mode="contained"
            />
          </div>
          <div>
            <dx-button
              @on-click="onClick"
              width="120px"
              text="Outlined"
              hint="Outlined"
              type="success"
              styling-mode="outlined"
            />
          </div>
          <div>
            <dx-button
              @on-click="onClick"
              width="120px"
              text="Text"
              hint="Text"
              type="success"
              styling-mode="text"
            />
          </div>
        </div>
        <div class="buttons-column">
          <div class="column-header">Default</div>
          <div>
            <dx-button
              @on-click="onClick"
              width="120px"
              text="Contained"
              hint="Contained"
              type="default"
              styling-mode="contained"
            />
          </div>
          <div>
            <dx-button
              @on-click="onClick"
              width="120px"
              text="Outlined"
              hint="Outlined"
              type="default"
              styling-mode="outlined"
            />
          </div>
          <div>
            <dx-button
              @on-click="onClick"
              width="120px"
              text="Text"
              hint="Text"
              type="default"
              styling-mode="text"
            />
          </div>
        </div>
        <div class="buttons-column">
          <div class="column-header">Danger</div>
          <div>
            <dx-button
              @on-click="onClick"
              width="120px"
              text="Contained"
              hint="Contained"
              type="danger"
              styling-mode="contained"
            />
          </div>
          <div>
            <dx-button
              @on-click="onClick"
              width="120px"
              text="Outlined"
              hint="Outlined"
              type="danger"
              styling-mode="outlined"
            />
          </div>
          <div>
            <dx-button
              @on-click="onClick"
              width="120px"
              text="Text"
              hint="Text"
              type="danger"
              styling-mode="text"
            />
          </div>
        </div>
        <div class="buttons-column">
          <div class="column-header">Default options</div>
          <div>
            <dx-button
              @on-click="onClick"
              width="120px"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="demo-case">Last clicked button - {{lastClickedButton}}</div>
    <div class="demo-case buttons">
      <div>
        <div class="buttons-column">
          <div class="column-header">Normal {{toggle ? 'ON' : 'OFF'}}</div>
          <div>
            <dx-toggle-button
              width="120px"
              text="Outlined"
              hint="Outlined"
              type="normal"
              styling-mode="outlined"
            />
          </div>
        </div>
        <div class="buttons-column">
          <div class="column-header">Success {{toggle ? 'ON' : 'OFF'}}</div>
          <div>
            <dx-toggle-button
              :pressed="toggle"
              @pressed-change="toggleChanged"
              width="120px"
              text="Outlined"
              hint="Outlined"
              type="success"
              styling-mode="outlined"
            />
          </div>
        </div>
        <div class="buttons-column">
          <div class="column-header">Default {{toggle ? 'ON' : 'OFF'}}</div>
          <div>
            <dx-toggle-button
              :pressed="toggle"
              @pressed-change="toggleChanged"
              width="120px"
              text="Outlined"
              hint="Outlined"
              type="default"
              styling-mode="outlined"
            />
          </div>
        </div>
        <div class="buttons-column">
          <div class="column-header">Danger {{toggle ? 'ON' : 'OFF'}}</div>
          <div>
            <dx-toggle-button
              :pressed="toggle"
              @pressed-change="toggleChanged"
              width="120px"
              text="Outlined"
              hint="Outlined"
              type="danger"
              styling-mode="outlined"
            />
          </div>
        </div>
        <div class="buttons-column">
          <div class="column-header">Default options</div>
          <div>
            <dx-toggle-button
              width="120px"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="demo-case buttonGroups">
      <dx-button-group
        :items="fontStyles"
        :selected-items="selectedButtons"
        @selected-items-change="buttonSelected"
        selection-mode="multiple"
        styling-mode="outlined"
        key-expr="style"
      />
      <dx-button-group
        :items="fontStyles"
        :selected-items="selectedButtons"
        @selected-items-change="buttonSelected"
        selection-mode="multiple"
        styling-mode="contained"
        key-expr="style"
      />
      <dx-button-group
        :items="fontStyles"
        :selected-items="['bold', 'strike']"
        selection-mode="single"
        styling-mode="text"
        key-expr="style"
      />
      <dx-button-group
        :items="fontStyles"
        selection-mode="single"
        styling-mode="text"
        key-expr="style"
      />
    </div>

    <div class="demo-case drawer">
      <div class="drawer-toolbar">
        <dx-button
          @on-click="drawerHandleClick"
          :text="drawerOpened ? 'Close the drawer!' : 'Open the drawer!'"
          hint="Contained"
          type="normal"
          styling-mode="contained"
        />
      </div>
      <dx-drawer
        :opened="drawerOpened"
        @opened-change="toggleDrawer"
        hint="my drawer"
        width="800px"
      >
        <template v-slot:drawer>
          <div>
            <dx-button
              width="100%"
              text="Push me!"
              styling-mode="text"
              @on-click="toggleDrawer(false)"
            />
            <dx-button
              width="100%"
              text="Push me!"
              styling-mode="text"
              @on-click="toggleDrawer(false)"
            />
            <dx-button
              width="100%"
              text="Push me!"
              styling-mode="text"
              @on-click="toggleDrawer(false)"
            />
            <dx-button
              width="100%"
              text="Push me!"
              styling-mode="text"
              @on-click="toggleDrawer(false)"
            />
            <dx-button
              width="100%"
              text="Push me!"
              styling-mode="text"
              @on-click="toggleDrawer(false)"
            />
            <dx-button
              width="100%"
              text="Push me!"
              styling-mode="text"
              @on-click="toggleDrawer(false)"
            />
          </div>
        </template>

        <!-- <template v-slot:default> -->
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Penatibus et magnis dis parturient. Eget dolor morbi non arcu risus. Tristique magna sit amet purus gravida quis blandit. Auctor urna nunc id cursus metus aliquam eleifend mi in. Tellus orci ac auctor augue mauris augue neque gravida. Nullam vehicula ipsum a arcu. Nullam ac tortor vitae purus faucibus ornare suspendisse sed nisi. Cursus in hac habitasse platea dictumst. Egestas dui id ornare arcu. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim.</p>
        <p>Mauris rhoncus aenean vel elit scelerisque mauris pellentesque pulvinar. Neque volutpat ac tincidunt vitae semper quis lectus. Sed sed risus pretium quam vulputate dignissim suspendisse in. Urna nec tincidunt praesent semper feugiat nibh sed pulvinar. Ultricies lacus sed turpis tincidunt id aliquet risus feugiat. Amet cursus sit amet dictum sit amet justo donec enim. Vestibulum rhoncus est pellentesque elit ullamcorper. Id aliquet risus feugiat in ante metus dictum at.</p>
        <!-- </template> -->
      </dx-drawer>
    </div>

    <div class="demo-case lists">
      <div>
        <div class="lists-column">
          <dx-button
            text="Export"
            type="normal"
            styling-mode="contained"
            @on-click="$refs.list_ref.export()"
          />
          <dx-list
            :items="taskList"
            :selected-items="selectedListItems"
            @selected-items-change="setSelectedListItems"
            ref="list_ref"
            width="400px"
            height="300px"
          ></dx-list>
        </div>
        <div class="lists-column">
          <dx-list
            :items="taskList"
            :selected-items="selectedListItems"
            @selected-items-change="setSelectedListItems"
            width="400px"
            height="300px"
          ></dx-list>
        </div>
        <div class="lists-column">
          <!-- itemRender={productRender} -->
          <dx-list
            :items="products"
            :selected-items="selectedListItems"
            @selected-items-change="setSelectedListItems"
            key-expr="ID"
            display-expr="Name"
            width="400px"
            height="300px"
          >
            <template #item-render="item">
              <custom-list-item :item="item"/>
            </template>
          </dx-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DxButton from "./components/DxButton.vue";
import DxToggleButton from "./components/DxToggleButton.vue";
import DxButtonGroup from "./components/DxButtonGroup.vue";
import DxDrawer from "./components/DxDrawer.vue";
import DxList from "./components/DxList.vue";

import CustomListItem from './components/CustomListItem.vue';

export default {
  name: "app",
  components: {
    DxButton,
    DxToggleButton,
    DxButtonGroup,
    DxDrawer,
    DxList,
    CustomListItem
  },
  data() {
    return {
      lastClickedButton: "",
      elementAttr: { id: 'Button_1', 'data_my_data': 'this is my button' },
      toggle: true,
      drawerOpened: false,
      selectedButtons: ["bold", "strike"],
      selectedListItems: [],
      fontStyles: [
        {
          text: "B",
          style: "bold",
          hint: "Bold",
          type: "success"
        },
        {
          text: "I",
          style: "italic",
          hint: "Italic",
          type: "success"
        },
        {
          text: "U",
          style: "underline",
          hint: "Underlined",
          type: "success"
        },
        {
          text: "S",
          style: "strike",
          hint: "Strikethrough",
          type: "success"
        }
      ],
      taskList: [
        "Prepare 2016 Financial",
        "Prepare 2016 Marketing Plan",
        "Update Personnel Files",
        "Review Health Insurance Options Under the Affordable Care Act",
        "New Brochures",
        "2016 Brochure Designs",
        "Brochure Design Review",
        "Website Re-Design Plan",
        "Rollout of New Website and Marketing Brochures",
        "Update Sales Strategy Documents",
        "Create 2012 Sales Report",
        "Direct vs Online Sales Comparison Report",
        "Review 2012 Sales Report and Approve 2016 Plans",
        "Deliver R&D Plans for 2016",
        "Create 2016 R&D Plans",
        "2016 QA Strategy Report",
        "2016 Training Events",
        "Approve Hiring of John Jeffers",
        "Non-Compete Agreements",
        "Update NDA Agreement",
        "Update Employee Files with New NDA",
        "Sign Updated NDA",
        "Submit Questions Regarding New NDA",
        "Submit Signed NDA",
        "Update Revenue Projections",
        "Review Revenue Projections",
        "Comment on Revenue Projections",
        "Provide New Health Insurance Docs",
        "Review Changes to Health Insurance Coverage",
        "Scan Health Insurance Forms",
        "Sign Health Insurance Forms",
        "Follow up with West Coast Stores",
        "Follow up with East Coast Stores",
        "Send Email to Customers about Recall",
        "Submit Refund Report for 2016 Recall",
        "Give Final Approval for Refunds",
        "Prepare Product Recall Report",
        "Review Product Recall Report by Engineering Team",
        "Create Training Course for New TVs",
        "Review Training Course for any Ommissions",
        "Review Overtime Report",
        "Submit Overtime Request Forms",
        "Overtime Approval Guidelines",
        "Refund Request Template",
        "Recall Rebate Form",
        "Create Report on Customer Feedback",
        "Review Customer Feedback Report",
        "Customer Feedback Report Analysis",
        "Prepare Shipping Cost Analysis Report",
        "Provide Feedback on Shippers",
        "Select Preferred Shipper",
        "Complete Shipper Selection Form",
        "Upgrade Server Hardware",
        "Upgrade Personal Computers",
        "Approve Personal Computer Upgrade Plan",
        "Decide on Mobile Devices to Use in the Field",
        "Upgrade Apps to Windows RT or stay with WinForms",
        "Estimate Time Required to Touch-Enable Apps",
        "Report on Tranistion to Touch-Based Apps",
        "Try New Touch-Enabled WinForms Apps",
        "Rollout New Touch-Enabled WinForms Apps",
        "Site Up-Time Report",
        "Review Site Up-Time Report",
        "Review Online Sales Report",
        "Determine New Online Marketing Strategy",
        "New Online Marketing Strategy",
        "Approve New Online Marketing Strategy",
        "Submit New Website Design",
        "Create Icons for Website",
        "Review PSDs for New Website",
        "Create New Shopping Cart",
        "Create New Product Pages",
        "Review New Product Pages",
        "Approve Website Launch",
        "Launch New Website",
        "Update Customer Shipping Profiles",
        "Create New Shipping Return Labels",
        "Get Design for Shipping Return Labels",
        "PSD needed for Shipping Return Labels",
        "Request Bandwidth Increase from ISP",
        "Submit D&B Number to ISP for Credit Approval",
        "Contact ISP and Discuss Payment Options",
        "Prepare Year-End Support Summary Report",
        "Analyze Support Traffic for 2016",
        "Review New Training Material",
        "Distribute Training Material to Support Staff",
        "Training Material Distribution Schedule",
        "Provide New Artwork to Support Team",
        "Publish New Art on the Server",
        "Replace Old Artwork with New Artwork",
        "Ship New Brochures to Field",
        "Ship Brochures to Todd Hoffman",
        "Update Server with Service Packs",
        "Install New Database",
        "Approve Overtime for HR",
        "Review New HDMI Specification",
        "Approval on Converting to New HDMI Specification",
        "Create New Spike for Automation Server",
        "Report on Retail Sales Strategy for 2014",
        "Code Review - New Automation Server",
        "Feedback on New Training Course",
        "Send Monthly Invoices from Shippers",
        "Schedule Meeting with Sales Team",
        "Confirm Availability for Sales Meeting",
        "Reschedule Sales Team Meeting",
        "Send 2 Remotes for Giveaways",
        "Ship 2 Remotes Priority to Clark Morgan",
        "Discuss Product Giveaways with Management",
        "Follow Up Email with Recent Online Purchasers",
        "Replace Desktops on the 3rd Floor",
        "Update Database with New Leads",
        "Mail New Leads for Follow Up",
        "Send Territory Sales Breakdown",
        "Territory Sales Breakdown Report",
        "Return Merchandise Report",
        "Report on the State of Engineering Dept",
        "Staff Productivity Report",
        "Review HR Budget Company Wide",
        "Sales Dept Budget Request Report",
        "Support Dept Budget Report",
        "IT Dept Budget Request Report",
        "Engineering Dept Budget Request Report",
        "1Q Travel Spend Report",
        "Approve Benefits Upgrade Package",
        "Final Budget Review",
        "State of Operations Report",
        "Online Sales Report",
        "Reprint All Shipping Labels",
        "Shipping Label Artwork",
        "Specs for New Shipping Label",
        "Move Packaging Materials to New Warehouse",
        "Move Inventory to New Warehouse",
        "Take Forklift to Service Center",
        "Approve Rental of Forklift",
        "Give Final Approval to Rent Forklift",
        "Approve Overtime Pay",
        "Approve Vacation Request",
        "Approve Salary Increase Request",
        "Review Complaint Reports",
        "Review Website Complaint Reports",
        "Test New Automation App",
        "Fix Synchronization Issues",
        "Free Up Space for New Application Set",
        "Install New Router in Dev Room",
        "Update Your Profile on Website",
        "Schedule Conf Call with SuperMart",
        "Support Team Evaluation Report",
        "Create New Installer for Company Wide App Deployment",
        "Pickup Packages from the Warehouse",
        "Sumit Travel Expenses for Recent Trip",
        "Make Travel Arrangements for Sales Trip to San Francisco",
        "Book Flights to San Fran for Sales Trip",
        "Collect Customer Reviews for Website",
        "Submit New W4 for Updated Exemptions",
        "Get New Frequent Flier Account",
        "Review New Customer Follow Up Plan",
        "Submit Customer Follow Up Plan Feedback",
        "Review Issue Report and Provide Workarounds",
        "Contact Customers for Video Interviews",
        "Resubmit Request for Expense Reimbursement",
        "Approve Vacation Request Form",
        "Email Test Report on New Products",
        "Send Receipts for all Flights Last Month"
      ].map(item => ({ value: item })),
      products: [
        {
          ID: 1,
          Name: "HD Video Player",
          Price: 330,
          Current_Inventory: 225,
          Backorder: 0,
          Manufacturing: 10,
          Category: "Video Players",
          ImageSrc: "images/products/1.png"
        },
        {
          ID: 3,
          Name: "SuperPlasma 50",
          Price: 2400,
          Current_Inventory: 0,
          Backorder: 0,
          Manufacturing: 0,
          Category: "Televisions",
          ImageSrc: "images/products/3.png"
        },
        {
          ID: 4,
          Name: "SuperLED 50",
          Price: 1600,
          Current_Inventory: 77,
          Backorder: 0,
          Manufacturing: 55,
          Category: "Televisions",
          ImageSrc: "images/products/4.png"
        },
        {
          ID: 5,
          Name: "SuperLED 42",
          Price: 1450,
          Current_Inventory: 445,
          Backorder: 0,
          Manufacturing: 0,
          Category: "Televisions",
          ImageSrc: "images/products/5.png"
        },
        {
          ID: 6,
          Name: "SuperLCD 55",
          Price: 1350,
          Current_Inventory: 345,
          Backorder: 0,
          Manufacturing: 5,
          Category: "Televisions",
          ImageSrc: "images/products/6.png"
        },
        {
          ID: 7,
          Name: "SuperLCD 42",
          Price: 1200,
          Current_Inventory: 210,
          Backorder: 0,
          Manufacturing: 20,
          Category: "Televisions",
          ImageSrc: "images/products/7.png"
        },
        {
          ID: 8,
          Name: "SuperPlasma 65",
          Price: 3500,
          Current_Inventory: 0,
          Backorder: 0,
          Manufacturing: 0,
          Category: "Televisions",
          ImageSrc: "images/products/8.png"
        },
        {
          ID: 9,
          Name: "SuperLCD 70",
          Price: 4000,
          Current_Inventory: 95,
          Backorder: 0,
          Manufacturing: 5,
          Category: "Televisions",
          ImageSrc: "images/products/9.png"
        },
        {
          ID: 10,
          Name: "DesktopLED 21",
          Price: 175,
          Current_Inventory: null,
          Backorder: 425,
          Manufacturing: 75,
          Category: "Monitors",
          ImageSrc: "images/products/10.png"
        },
        {
          ID: 12,
          Name: "DesktopLCD 21",
          Price: 170,
          Current_Inventory: 210,
          Backorder: 0,
          Manufacturing: 60,
          Category: "Monitors",
          ImageSrc: "images/products/12.png"
        },
        {
          ID: 13,
          Name: "DesktopLCD 19",
          Price: 160,
          Current_Inventory: 150,
          Backorder: 0,
          Manufacturing: 210,
          Category: "Monitors",
          ImageSrc: "images/products/13.png"
        },
        {
          ID: 14,
          Name: "Projector Plus",
          Price: 550,
          Current_Inventory: null,
          Backorder: 55,
          Manufacturing: 10,
          Category: "Projectors",
          ImageSrc: "images/products/14.png"
        },
        {
          ID: 15,
          Name: "Projector PlusHD",
          Price: 750,
          Current_Inventory: 110,
          Backorder: 0,
          Manufacturing: 90,
          Category: "Projectors",
          ImageSrc: "images/products/15.png"
        },
        {
          ID: 17,
          Name: "ExcelRemote IR",
          Price: 150,
          Current_Inventory: 650,
          Backorder: 0,
          Manufacturing: 190,
          Category: "Automation",
          ImageSrc: "images/products/17.png"
        },
        {
          ID: 18,
          Name: "ExcelRemote BT",
          Price: 180,
          Current_Inventory: 310,
          Backorder: 0,
          Manufacturing: 0,
          Category: "Automation",
          ImageSrc: "images/products/18.png"
        },
        {
          ID: 19,
          Name: "ExcelRemote IP",
          Price: 200,
          Current_Inventory: 0,
          Backorder: 325,
          Manufacturing: 225,
          Category: "Automation",
          ImageSrc: "images/products/19.png"
        }
      ]
    };
  },
  methods: {
    onClick(e) {
      this.lastClickedButton = `${e.type} - ${e.text}`;
    },
    changeElementAttr() {
      if(this.elementAttr.data_my_other_data) {
        this.elementAttr = { ...this.elementAttr, data_my_other_data: ""};
      } else {
        this.elementAttr = { ...this.elementAttr, data_my_other_data: "yes"};
      }
    },
    drawerHandleClick() {
      this.drawerOpened = !this.drawerOpened;
    },
    toggleDrawer(opened) {
      this.drawerOpened = opened;
    },
    toggleChanged(toggle) {
      this.toggle = toggle;
    },
    buttonSelected(selectedButtons) {
      this.selectedButtons = selectedButtons.slice();
    },
    setSelectedListItems(list) {
      this.selectedListItems = list.slice();
    }
  }
};
</script>

<style>
body {
  margin: 0;
  padding: 10px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}

.buttons-column > .column-header {
  flex-grow: 0;
  width: 150px;
  height: 35px;
  font-size: 130%;
  opacity: 0.6;
  text-align: left;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.buttons > div {
  width: 100%;
  flex-wrap: nowrap;
  display: flex;
}

.buttons-column > div {
  width: 150px;
  height: 50px;
}

.buttons-column {
  width: 150px;
  justify-content: center;
}

.buttonGroups > div {
  padding: 0 12px 0 0;
}

.demo-case {
  padding: 5px 0px;
}

.drawer {
  width: 800px;
}

.drawer .drawer-toolbar {
  background-color: rgba(191, 191, 191, .15);
  padding: 5px 10px;
}

.lists {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.lists > div {
  width: 100%;
  flex-wrap: nowrap;
  display: flex;
}

.lists-column {
  padding: 0 10px;
}


.product {
  height: 65px;
}

.product > img {
  height: 100%;
  width: 95px;
  float: left;
}

.product > div {
  padding-left: 10px;
  vertical-align: top;
  line-height: 65px;
  font-size: 15px;
  float: left;
}

.product > div.price {
  float: right;
  font-size: 18px;
}
</style>
