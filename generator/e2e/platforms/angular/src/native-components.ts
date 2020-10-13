import "core-js/proposals/reflect-metadata";
import "zone.js/dist/zone";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/pages/native-components/app.module";

platformBrowserDynamic().bootstrapModule(AppModule).catch(console.error);
