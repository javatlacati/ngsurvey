import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SurveyComponent} from "./controllers/survey/survey.component";

const routes: Routes = [
  {path: 'survey', component: SurveyComponent},
  {path:'**', pathMatch: 'full', redirectTo:'survey'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
