import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {DatetimeService} from "../../services/datetime/datetime.service";

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss'
})
export class ProgressComponent implements OnInit, OnDestroy {
  currentTimestamp: number = Date.now();
  maxTimestamp: number = Date.now();
  minTimestamp: number = 0;
  isPaused: boolean = false;
  isLive: boolean = true;
  subscriptions: Subscription[] = [];
  STEP: Number = 500;

  constructor(private datetimeService: DatetimeService) {
  }
  ngOnInit(): void {
    let currentTimestampSubscription = this.datetimeService.getCurrentTimestamp()
      .subscribe(res => this.currentTimestamp = res);
    let maxTimestampSubscription = this.datetimeService.getMaxTimestamp()
      .subscribe(res => this.maxTimestamp = res);
    let minTimestampSubscription = this.datetimeService.getMinTimestamp()
      .subscribe(res => this.minTimestamp = res);
    let isPausedSubscription = this.datetimeService.getIsPaused()
      .subscribe(res => this.isPaused = res);
    let isLiveSubscription = this.datetimeService.getIsLive()
      .subscribe(res => this.isLive = res);
    this.subscriptions.push(currentTimestampSubscription,
                            maxTimestampSubscription,
                            minTimestampSubscription,
                            isPausedSubscription,
                            isLiveSubscription)
  }

  changeCurrentValue(event: any) {
    this.datetimeService.setIsPaused(true);
    this.datetimeService.setCurrentTimestamp(Number(event.target.value));
  }

  toggleIsPaused(){
    console.log(this.isPaused)
    this.datetimeService.setIsPaused(!this.isPaused)
  }

  goLive() {
    this.datetimeService.setIsPaused(false);
    this.datetimeService.setIsLive(true)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
