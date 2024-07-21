import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components-wip/homepage/homepage.component';
import { HomepageV2Component } from './components-active/homepage-v2/homepage-v2.component';
import { AboutComponent } from './components-wip/about/about.component';
import { ExperimentalComponent } from './components-active/experimental/experimental.component';
import { About2Component } from './components-active/about2/about2.component';
import { EnterpriseComponent } from './components-active/enterprise/enterprise.component';
import { ButtonComponent } from './components-active/button/button.component';
import { ContactComponent } from './components-active/contact/contact.component';
import { PhysicsHomeComponent } from './physics/physics-home/physics-home.component';
import { GravHomeComponent } from './gravity/grav-home/grav-home.component';
import { TrainHomeComponent } from './train/train-home/train-home.component';
import { ProjectsComponent } from './components-active/projects/projects.component';
import { Train2Component } from './train2/train2/train2.component';
import { AnimTestComponent } from './components-wip/anim-test/anim-test.component';
import { SalesforceComponent } from './salesforce/salesforce.component';
import { Salesforce2Component } from './salesforce2/salesforce2.component';

const routes: Routes = [
  { path: 'main', component: HomepageV2Component },
  { path: 'about', component: About2Component },
  { path: 'sandbox', component: ExperimentalComponent },
  { path: 'enterprise', component: EnterpriseComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'physics', component: PhysicsHomeComponent },
  { path: 'gravity-sim', component: GravHomeComponent },
  { path: 'train', component: TrainHomeComponent },
  { path: 'train2', component: Train2Component },
  { path: 'projects', component: ProjectsComponent },
  { path: 'anim-test', component: AnimTestComponent },
  { path: 'salesforce', component: SalesforceComponent },
  { path: 'salesforce2', component: Salesforce2Component },
  { path: '', redirectTo: '/main', pathMatch: 'full' }, // redirect to `homepage`
  { path: '**', redirectTo: '/main', pathMatch: 'full'},  // Wildcard route for a 404 page, have not gotten to this
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
