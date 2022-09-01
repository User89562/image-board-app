import { ArchiveDeleteFilterComponent } from './archive-delete-filter/archive-delete-filter.component';
import { NgModule } from '@angular/core';
import { FileSearchComponent } from './file-search/file-search.component';
import { LoginComponent } from './login/login.component';

import { ExtraOptions, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

const routerOptions: ExtraOptions = {
 // preloadingStrategy: PreloadAllModules,
  onSameUrlNavigation: 'reload',
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled',

};

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'archive-delete-filter', canActivate:[AuthGuard], component: ArchiveDeleteFilterComponent},
  {path: 'file-search', canActivate:[AuthGuard], component: FileSearchComponent},
  {path: '',  redirectTo: 'file-search', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
