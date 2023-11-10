import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './components-wip/homepage/homepage.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomepageV2Component } from './components-active/homepage-v2/homepage-v2.component';
import { AboutComponent } from './components-wip/about/about.component';
import { HistoryComponent } from './components-wip/history/history.component';
import { ExperimentalComponent } from './components-active/experimental/experimental.component';
import { About2Component } from './components-active/about2/about2.component';
import { History2Component } from './components-active/history2/history2.component';
import { EnterpriseComponent } from './components-active/enterprise/enterprise.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { ButtonComponent } from './components-active/button/button.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { TableComponent } from './components-active/table/table.component';
import { TableModule } from 'primeng/table';
import {MatIconModule} from '@angular/material/icon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ContactComponent } from './components-active/contact/contact.component';
import { ContactContentsComponent } from './components-active/contact-contents/contact-contents.component';
import { PhysicsHomeComponent } from './physics/physics-home/physics-home.component';
import { SwitchComponent } from './physics/switch/switch.component';
import {MatMenuModule} from '@angular/material/menu';
import { PhysicsIntroComponent } from './physics/physics-intro/physics-intro.component';

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
    PhysicsIntroComponent
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
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
