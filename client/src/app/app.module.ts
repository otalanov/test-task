import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import {RouterOutlet} from "@angular/router";
import {ProgressComponent} from "./components/progress/progress.component";
import {DataService} from "./services/data/data.service";
import {dbConfig} from "./dbconfig";


@NgModule({
  declarations: [
    AppComponent,
    ProgressComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    RouterOutlet
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
