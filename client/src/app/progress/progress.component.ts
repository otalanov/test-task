import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {interval, Subject, Subscription} from "rxjs";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.css'
})
export class ProgressComponent implements OnInit, OnDestroy {
  @Input() minTimestamp: number = 0;
  @Output() currentTimestampChanged: EventEmitter<number> = new EventEmitter<number>();
  maxTimestamp$: Subject<number> = new Subject<number>();
  // currentTimestamp$: Subject<Number> = new Subject<Number>();
  currentTimestamp: number = Date.now();
  isPaused: Boolean = false;
  isLive: Boolean = true;
  subscriptions: Subscription[] = [];
  TICK_PERIOD: number = 500;

  ngOnInit(): void {
    const tick = interval(this.TICK_PERIOD);
    let maxProgressSub = tick.subscribe(() => {
      this.maxTimestamp$.next(Date.now());
      if (this.isPaused) {
        this.isLive = false;
      }
      if (this.isLive) {
        this.isPaused = false;
        this.currentTimestamp = Date.now();
        this.maxTimestamp$.next(this.currentTimestamp);
        this.currentTimestampChanged.emit(this.currentTimestamp);
      } else {
        this.maxTimestamp$.next(Date.now());
        if (!this.isPaused) {
          this.currentTimestamp += this.TICK_PERIOD;
          this.currentTimestampChanged.emit(this.currentTimestamp);
        }
      }
    })
    this.subscriptions.push(maxProgressSub);
  }

  changeCurrentValue(event: any) {
    this.isPaused = true;
    this.currentTimestamp = Number(event.target.value);
    this.currentTimestampChanged.emit(this.currentTimestamp);
  }

  toggleIsLive() {
    this.isLive = !this.isLive;
    if (this.isLive) {
      this.isPaused = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
