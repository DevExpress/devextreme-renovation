import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { FormsModule } from "@angular/forms";
import { DxCounterModule } from "../../../../../../components/counter";
import { DxWithNestedModule } from "../../../../../../components/nested";
import { DxButtonWithTemplateModule } from "../../../../../../components/button-with-template";
import { DxUndefWidgetModule } from "../../../../../../components/nested-undefined-component";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    DxCounterModule,
    DxWithNestedModule,
    DxButtonWithTemplateModule,
    DxUndefWidgetModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
