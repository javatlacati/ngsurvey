import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SurveyComponent } from './controllers/survey/survey.component';
import {AppRoutingModule} from "./app-routing.module";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    SurveyComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        GraphQLModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatInputModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
