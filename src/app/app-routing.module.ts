import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { ExtraOptions, PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

const routerOptions: ExtraOptions = {
  preloadingStrategy: PreloadAllModules,
  onSameUrlNavigation: 'reload',
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled',

};

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  { path: '', canLoad:[AuthGuard], loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
