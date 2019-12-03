import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent {
  fontStyles = [{
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
  lastClickedButton: string;
  toggle = true;
  drawerOpened = false;
  selectedItems = ['bold', 'strike'];

  onClick(e) {
      this.lastClickedButton = `${e.type} - ${e.text}`
  }

  toggleDrawer() {
    this.drawerOpened = !this.drawerOpened;
  }
}
