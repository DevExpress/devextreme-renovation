import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DxButtonModule } from "./DxButton";
import { DxToggleButtonModule } from "./DxToggleButton";
import { DxButtonGroupModule } from "./DxButtonGroup"
import { DxDrawerModule } from "./DxDrawer"
import { DxListModule } from "./DxList"

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DxButtonModule,
    DxToggleButtonModule,
    DxButtonGroupModule,
    DxDrawerModule,
    DxListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
