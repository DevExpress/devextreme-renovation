import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DxButtonComponent } from "./DxButton";
import { DxToggleButtonComponent } from "./DxToggleButton";
import { DxButtonGroupComponent } from "./DxButtonGroup"

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    DxButtonComponent,
    DxToggleButtonComponent,
    DxButtonGroupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
