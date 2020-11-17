import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { DxButtonModule } from "./DxButton";
import { DxToggleButtonModule } from "./DxToggleButton";
import { DxButtonGroupModule } from "./DxButtonGroup";
import { DxDrawerModule } from "./DxDrawer";
import { DxListModule } from "./DxList";
import { DxDynamicComponentCreatorModule } from "./DxDynamicComponent";

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    DxButtonModule,
    DxToggleButtonModule,
    DxButtonGroupModule,
    DxDrawerModule,
    DxListModule,
    DxDynamicComponentCreatorModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
