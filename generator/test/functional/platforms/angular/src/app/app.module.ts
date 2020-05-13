import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { DxAppModule } from '../../../../components/app';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DxAppModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
