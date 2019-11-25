import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DxButtonModule } from "./DxButton";
import { DxToggleButtonModule } from "./DxToggleButton";
import { DxButtonGroupModule } from "./DxButtonGroup"

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DxButtonModule,
    DxToggleButtonModule,
    DxButtonGroupModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
