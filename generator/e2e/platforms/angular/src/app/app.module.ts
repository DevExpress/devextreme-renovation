import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { DxAppModule } from "../../../../components/app";
import { DxButtonWithTemplateModule } from "../../../../components/button-with-template";
import { DxCounterModule } from "../../../../components/counter";
import { DxWithNestedModule } from "../../../../components/nested";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    DxAppModule,
    DxButtonWithTemplateModule,
    DxCounterModule,
    DxWithNestedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
