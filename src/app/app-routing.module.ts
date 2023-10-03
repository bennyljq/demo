import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components-wip/homepage/homepage.component';
import { HomepageV2Component } from './components-active/homepage-v2/homepage-v2.component';
import { AboutComponent } from './components-wip/about/about.component';
import { ExperimentalComponent } from './components-active/experimental/experimental.component';
import { About2Component } from './components-active/about2/about2.component';
import { EnterpriseComponent } from './components-active/enterprise/enterprise.component';

const routes: Routes = [
  { path: 'main', component: HomepageV2Component },
  { path: 'about', component: About2Component },
  { path: 'experimental', component: ExperimentalComponent },
  { path: 'enterprise', component: EnterpriseComponent },
  { path: '', redirectTo: '/main', pathMatch: 'full' }, // redirect to `homepage`
  // { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
