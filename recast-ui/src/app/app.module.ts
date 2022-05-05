import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { StepperUiComponent } from './stepper-ui/stepper-ui.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatStepperModule} from '@angular/material/stepper';
import { SourceSystemComponent } from './source-system/source-system.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
//import {MatNativeDateModule} from '@angular/material/'
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ConnectionParamComponent } from './connection-param/connection-param.component'; 
import { NgxMatStepLazyLoadModule } from 'ngx-mat-step-lazy-load';
import { AnalyzerComponent } from './analyzer/analyzer.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { ChartsComponent } from './charts/charts.component';
import { EstablishConnectionComponent } from './establish-connection/establish-connection.component';

import { HighchartsChartComponent} from 'highcharts-angular';
import * as drilldown from 'highcharts/modules/drilldown.src';
import { HIGHCHARTS_MODULES } from 'angular-highcharts';
import { ChartModule } from 'angular-highcharts';
import { FinishComponent } from './finish/finish.component';

import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatTreeModule} from '@angular/material/tree';

import {AngularTreeTableModule} from 'angular-tree-table';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    StepperUiComponent,
    SourceSystemComponent,
    ConnectionParamComponent,
    AnalyzerComponent,
    TaskDetailsComponent,
    ChartsComponent,
    EstablishConnectionComponent,
    HighchartsChartComponent,
    FinishComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatStepperModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    HttpClientModule,
    NgxMatStepLazyLoadModule,
    ChartsModule,
    CommonModule,
    ChartModule,
    CdkTableModule,
    CdkTreeModule,
    MatTreeModule,
    AngularTreeTableModule
  ],
  providers: [
    {provide: HIGHCHARTS_MODULES,
      useFactory: () => [ drilldown]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
