import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import DxApp from '../../../../components/app';
import DxSimple from '../../../../components/simple';
import DxButton from '../../../../components/button';
import DxButtonWithState from '../../../../components/state';
import DxComponentWithSpread from '../../../../components/spread-attributes';

@NgModule({
  declarations: [
    AppComponent,
    DxSimple,
    DxApp,
    DxButton,
    DxButtonWithState,
    DxComponentWithSpread
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
