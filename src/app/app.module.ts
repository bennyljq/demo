import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HammerModule } from '@angular/platform-browser';
import {ClipboardModule} from '@angular/cdk/clipboard';

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

// PrimeNG //
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

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
import { TrainHomeComponent } from './train/train-home/train-home.component';


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
    TableComponent,
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
    TrainHomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatGridListModule,
    TableModule,
    MatIconModule,
    InputTextModule,
    FormsModule,
    MatMenuModule,
    [MathjaxModule.forRoot()],
    HammerModule,
    ClipboardModule,
    MatSliderModule,
    MatDialogModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
