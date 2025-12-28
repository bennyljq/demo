import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import {ClipboardModule} from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';

// Components //
import { HomepageComponent } from './components-wip/homepage/homepage.component';
import { HomepageV2Component } from './components-active/homepage-v2/homepage-v2.component';
import { AboutComponent } from './components-wip/about/about.component';
import { HistoryComponent } from './components-wip/history/history.component';
import { ExperimentalComponent } from './components-active/experimental/experimental.component';
import { About2Component } from './components-active/about2/about2.component';
import { History2Component } from './components-active/history2/history2.component';
import { EnterpriseComponent } from './components-active/enterprise/enterprise.component';
import { ButtonComponent } from './components-active/button/button.component';
import { TableComponent } from './components-active/table/table.component';
import { ContactComponent } from './components-active/contact/contact.component';
import { ContactContentsComponent } from './components-active/contact-contents/contact-contents.component';
import { PhysicsHomeComponent } from './physics/physics-home/physics-home.component';
import { SwitchComponent } from './physics/switch/switch.component';
import { PhysicsIntroComponent } from './physics/physics-intro/physics-intro.component';
import { PhysicsWattComponent } from './physics/physics-watt/physics-watt.component';
import { PhysicsBatteryComponent } from './physics/physics-battery/physics-battery.component';
import { PhysicsPowerComponent } from './physics/physics-power/physics-power.component';
import { GravHomeComponent } from './gravity/grav-home/grav-home.component';
import { GravDialogComponent } from './gravity/grav-dialog/grav-dialog.component';
import { TrainHomeComponent } from './train/train-home/train-home.component';
import { TrainDialogComponent } from './train/train-dialog/train-dialog.component';
import { TrainConceptComponent } from './train/train-concept/train-concept.component';
import { ProjectsComponent } from './components-active/projects/projects.component';
import { ProjectContentsComponent } from './components-active/project-contents/project-contents.component';
import { Train2Component } from './train2/train2/train2.component';
import { Train2HomeComponent } from './train2/train2-home/train2-home.component';
import { Train2ConceptComponent } from './train2/train2-concept/train2-concept.component';
import { AnimTestComponent } from './components-wip/anim-test/anim-test.component';
import { Train2AnalysisComponent } from './train2/train2-analysis/train2-analysis.component';
import { SalesforceComponent } from './salesforce/salesforce.component';
import { Salesforce2Component } from './salesforce2/salesforce2.component';
import { Train2PrelimConceptComponent } from './train2/train2-prelim-concept/train2-prelim-concept.component';
import { Train2DynamicStationComponent } from './train2/train2-dynamic-station/train2-dynamic-station.component';
import { BrownianMotionComponent } from './brownian-motion/brownian-motion.component';
import { BrownianMotion2Component } from './brownian-motion2/brownian-motion2.component';
import { GravityGameComponent } from './gravity-game/gravity-game.component';
import { ParallaxComponent } from './parallax/parallax.component';
import { Gravity2025Component } from './gravity2025/gravity2025.component';
import { Gravity2025DialogComponent } from './gravity2025-dialog/gravity2025-dialog.component';
import { Gravity2025DialogEditComponent } from './gravity2025-dialog-edit/gravity2025-dialog-edit.component';

// PrimeNG //
// import { TableModule } from 'primeng/table';
// import { InputTextModule } from 'primeng/inputtext';

// Angular Material //
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { MathjaxModule } from "mathjax-angular";
import {MatSliderModule} from '@angular/material/slider';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Gravity2025DialogGalleryComponent } from './gravity2025-dialog-gallery/gravity2025-dialog-gallery.component';
import { Gravity2025DialogVelocityComponent } from './gravity2025-dialog-velocity/gravity2025-dialog-velocity.component';


@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    HomepageV2Component,
    AboutComponent,
    HistoryComponent,
    ExperimentalComponent,
    About2Component,
    History2Component,
    EnterpriseComponent,
    ButtonComponent,
    // TableComponent,
    ContactComponent,
    ContactContentsComponent,
    PhysicsHomeComponent,
    SwitchComponent,
    PhysicsIntroComponent,
    PhysicsWattComponent,
    PhysicsBatteryComponent,
    PhysicsPowerComponent,
    GravHomeComponent,
    GravDialogComponent,
    TrainHomeComponent,
    TrainDialogComponent,
    TrainConceptComponent,
    ProjectsComponent,
    ProjectContentsComponent,
    Train2Component,
    Train2HomeComponent,
    Train2ConceptComponent,
    AnimTestComponent,
    Train2AnalysisComponent,
    SalesforceComponent,
    Salesforce2Component,
    Train2PrelimConceptComponent,
    Train2DynamicStationComponent,
    BrownianMotionComponent,
    BrownianMotion2Component,
    GravityGameComponent,
    ParallaxComponent,
    Gravity2025Component,
    Gravity2025DialogComponent,
    Gravity2025DialogEditComponent,
    Gravity2025DialogGalleryComponent,
    Gravity2025DialogVelocityComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatGridListModule,
    // TableModule,
    MatIconModule,
    // InputTextModule,
    FormsModule,
    MatMenuModule,
    [MathjaxModule.forRoot()],
    HammerModule,
    ClipboardModule,
    MatSliderModule,
    MatDialogModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    DragDropModule,
    TableComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
