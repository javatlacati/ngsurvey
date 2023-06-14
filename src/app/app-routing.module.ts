import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SurveyComponent} from "./controllers/survey/survey.component";
import {HomeComponent} from "./controllers/home/home.component";

const routes: Routes = [
  {path: 'survey/:uuid', component: SurveyComponent},
  {path: '', component: HomeComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
