import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArchiveDeleteFilterSelectListComponent } from '../archive-delete-filter-select-list/archive-delete-filter-select-list.component';
import { FileSearchComponent } from '../file-search/file-search.component';
import { AuthGuard } from '../guard/auth.guard';
import { HomeComponent } from './home.component';
const routes: Routes = [
  {
    path: "",
    canActivateChild: [AuthGuard],
    component: HomeComponent,
    children: [
      { path: "", redirectTo: "file-search", pathMatch: "full" },
      {path: 'file-search', canActivate:[AuthGuard], component: FileSearchComponent},
      {path: 'archive-delete-filter-selection', canActivate:[AuthGuard], component: ArchiveDeleteFilterSelectListComponent},  
    ],
    
  },
];





@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
