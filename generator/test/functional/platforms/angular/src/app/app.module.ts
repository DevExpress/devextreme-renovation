import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { DxAppModule } from '../../../../components/app';
import { DxButtonWithTemplateModule } from '../../../../components/button-with-template';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DxAppModule,
    DxButtonWithTemplateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
