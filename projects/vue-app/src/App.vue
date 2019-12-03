<template>
  <div>
    <div class="buttons">
      <div>
        <div class="buttons-column">
          <div class="column-header">Normal</div>
          <div>
            <dx-button
              width="120px"
              text="Contained"
              hint="Contained"
              type="normal"
              styling-mode="contained"
            />
          </div>
          <div>
            <dx-button
              @on-click="onClick"
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
      </div>
    </div>
    <div>Last clicked button - {{lastClickedButton}}</div>
    <div class="buttons">
      <div>
        <div class="buttons-column">
          <div class="column-header">Normal {{toggle ? 'ON' : 'OFF'}}</div>
          <div>
            <dx-toggle-button
              :pressed="toggle"
              @pressed-change="toggleChanged"
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
      </div>
    </div>
    <div class="buttonGroups">
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
    </div>

    <div class="drawer">
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
        width="800px">
        <template v-slot:drawer>
          <div>
            <dx-button width="100%" text="Push me!" styling-mode="text" @on-click="toggleDrawer(false)"/>
            <dx-button width="100%" text="Push me!" styling-mode="text" @on-click="toggleDrawer(false)"/>
            <dx-button width="100%" text="Push me!" styling-mode="text" @on-click="toggleDrawer(false)"/>
            <dx-button width="100%" text="Push me!" styling-mode="text" @on-click="toggleDrawer(false)"/>
            <dx-button width="100%" text="Push me!" styling-mode="text" @on-click="toggleDrawer(false)"/>
            <dx-button width="100%" text="Push me!" styling-mode="text" @on-click="toggleDrawer(false)"/>
          </div>
        </template>

        <!-- <template v-slot:default> -->
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Penatibus et magnis dis parturient. Eget dolor morbi non arcu risus. Tristique magna sit amet purus gravida quis blandit. Auctor urna nunc id cursus metus aliquam eleifend mi in. Tellus orci ac auctor augue mauris augue neque gravida. Nullam vehicula ipsum a arcu. Nullam ac tortor vitae purus faucibus ornare suspendisse sed nisi. Cursus in hac habitasse platea dictumst. Egestas dui id ornare arcu. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim.</p>
          <p>Mauris rhoncus aenean vel elit scelerisque mauris pellentesque pulvinar. Neque volutpat ac tincidunt vitae semper quis lectus. Sed sed risus pretium quam vulputate dignissim suspendisse in. Urna nec tincidunt praesent semper feugiat nibh sed pulvinar. Ultricies lacus sed turpis tincidunt id aliquet risus feugiat. Amet cursus sit amet dictum sit amet justo donec enim. Vestibulum rhoncus est pellentesque elit ullamcorper. Id aliquet risus feugiat in ante metus dictum at.</p>
        <!-- </template> -->
      </dx-drawer>
    </div>
  </div>
</template>

<script>
import DxButton from "./components/DxButton.vue";
import DxToggleButton from "./components/DxToggleButton.vue";
import DxButtonGroup from "./components/DxButtonGroup.vue";
import DxDrawer from "./components/DxDrawer.vue";

export default {
  name: "app",
  components: {
    DxButton,
    DxToggleButton,
    DxButtonGroup,
    DxDrawer
  },
  data() {
    return {
      lastClickedButton: "",
      toggle: true,
      drawerOpened: false,
      selectedButtons: ["bold", "strike"],
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
      ]
    };
  },
  methods: {
    onClick(e) {
      this.lastClickedButton = `${e.type} - ${e.text}`;
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
    }
  }
};
</script>

<style>
body {
  margin: 0;
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

.row:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}
.cell {
  padding: 20px;
  float: left;
}

.buttons-column > .column-header {
  flex-grow: 0;
  width: 150px;
  height: 35px;
  font-size: 130%;
  opacity: 0.6;
  text-align: left;
  padding-left: 15px;
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
  text-align: center;
}

.buttons-column {
  width: 150px;
  justify-content: center;
}

.buttonGroups > div {
  padding: 0 12px;
}

.drawer {
  padding: 15px;
  width: 800px;
}

.drawer .drawer-toolbar {
  background-color: rgba(191, 191, 191, .15);
  padding: 5px 10px;
}
</style>
