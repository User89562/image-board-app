import { HttpClientModule } from "@angular/common/http";
import { Injectable, NgModule } from "@angular/core";
import {
  BrowserModule,
  HammerGestureConfig,
  HammerModule,
  HAMMER_GESTURE_CONFIG,
} from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppSharedModule } from "./app-shared.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import * as Hammer from 'hammerjs';

@Injectable({providedIn: 'root'})
export class HammerConfig extends HammerGestureConfig {
  override overrides = {
    swipe: { direction: Hammer.DIRECTION_ALL },
    pan: {direction: Hammer.DIRECTION_ALL, threshold: 0}
  };
}

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HammerModule,
    HttpClientModule,
    AppRoutingModule,
    AppSharedModule,
  ],
  providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: HammerConfig }],
  bootstrap: [AppComponent],
})
export class AppModule {}
