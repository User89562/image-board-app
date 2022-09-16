import { ArchiveDeleteFilterSelectListComponent } from '../archive-delete-filter-select-list/archive-delete-filter-select-list.component';
import { AppSharedModule } from './../app-shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { FileSearchComponent } from '../file-search/file-search.component';
import { SearchTagInputComponent } from '../search-tag-input/search-tag-input.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { ImageDisplayChunkSelectListComponent } from '../image-display-chunk/image-display-chunk-select-list/image-display-chunk-select-list.component';


@NgModule({
  declarations: [
    HomeComponent,
    FileSearchComponent,
    SearchTagInputComponent,
    ToolbarComponent,
    ImageDisplayChunkSelectListComponent,
    
    ArchiveDeleteFilterSelectListComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    AppSharedModule
  ]
})
export class HomeModule { }
