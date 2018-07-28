import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NgShadowModule } from 'nativescript-ng-shadow';
import { HttpClientModule, HttpClient } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { appComponents, appRoutes } from "./app.routing";
import { MazeGeneratorService } from "~/shared/services/maze-generator.service";
import { PositioningService } from "~/shared/services/positioning.service";
import { AdsService } from "~/shared/services/ads.service";

@NgModule({
  declarations: [AppComponent, ...appComponents],
  bootstrap: [AppComponent],
  imports: [
    NativeScriptModule,
    NativeScriptRouterModule,
    NativeScriptRouterModule.forRoot(appRoutes),
    NgShadowModule,
    HttpClientModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
    MazeGeneratorService,
    HttpClient,
    PositioningService,
    AdsService
  ]
})
export class AppModule {}
