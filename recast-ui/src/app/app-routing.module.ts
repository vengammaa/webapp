import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LandingPageComponent} from './landing-page/landing-page.component'
//import {SourceSystemComponent} from './source-system/source-system.component'
import {StepperUiComponent} from './stepper-ui/stepper-ui.component';
import {TaskDetailsComponent} from './task-details/task-details.component';
const routes: Routes = [
  { path: '',redirectTo: 'recast', pathMatch: 'full' },
  { path: 'recast' ,component:LandingPageComponent},
  { path: 'recast/stepper', component: StepperUiComponent},
  { path: 'taskdetails' ,component:TaskDetailsComponent},
  // { path: '**', redirectTo: 'recast'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
  RouterModule.forRoot(routes, {useHash: true}) 
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
