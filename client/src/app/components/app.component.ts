import {Component, OnDestroy, OnInit} from '@angular/core';
import {mergeMap, Subscription} from "rxjs";
import {SignalsService} from "../services/signals/signals.service";
import {DatetimeService} from "../services/datetime/datetime.service";

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
