import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {mergeMap, Subject, Subscription} from "rxjs";
import {ProgressComponent} from "./progress/progress.component";
import {DataService} from "../services/data/data.service";
import {SignalsService} from "../services/signals/signals.service";
import {DatetimeService} from "../services/datetime/datetime.service";
import * as process from "process";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  dataCollectionFiltered: any[] = [];

  constructor(private signalsService: SignalsService,
              private datetimeService: DatetimeService) {
  }

  ngOnInit(): void {

    if (!window.indexedDB) {
      alert('Database is not supported')
    }

    let currentTimestampSub = this.datetimeService.getCurrentTimestamp().pipe(
      mergeMap(currentTimeStamp => this.signalsService.getSignals(currentTimeStamp))
    ).subscribe(res => {
      console.log(res)
      this.dataCollectionFiltered = res;
    });

    this.subscriptions.push(currentTimestampSub);

  }

  getTimestamp(item: any) {
    return item.timestamp;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    })
  }
}
