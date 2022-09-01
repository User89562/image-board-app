import { ArchiveDeleteFilterComponent } from './archive-delete-filter/archive-delete-filter.component';
import { ImageDisplayComponent } from './image-display/image-display.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { SearchTagInputComponent } from './search-tag-input/search-tag-input.component';
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppSharedModule } from "./app-shared.module";
import { AppComponent } from "./app.component";
import { FileSearchComponent } from "./file-search/file-search.component";
import { LoginComponent } from "./login/login.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FileSearchComponent,
    SearchTagInputComponent,
    ToolbarComponent,
    ImageDisplayComponent,
    ArchiveDeleteFilterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,    
    AppRoutingModule,   
    AppSharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
