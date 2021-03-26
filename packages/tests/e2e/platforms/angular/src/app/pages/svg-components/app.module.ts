import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { FormsModule } from "@angular/forms";
import { DxSvgAppModule } from "../../../../../../components/svg-components/app";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, DxSvgAppModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
