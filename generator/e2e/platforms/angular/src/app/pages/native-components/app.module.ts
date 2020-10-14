import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { FormsModule } from "@angular/forms";
import { DxCounterModule } from "../../../../../../components/counter";
import { DxWithNestedModule } from "../../../../../../components/nested";
import { DxButtonWithTemplateModule } from "../../../../../../components/button-with-template";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    DxCounterModule,
    DxWithNestedModule,
    DxButtonWithTemplateModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
