import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, interval, Observable, of, Subject, Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DatetimeService implements OnDestroy {
  public TICK_PERIOD: number = 500;
  private subscriptions: Subscription[] = [];
  private currentTimestampSub: BehaviorSubject<number> = new BehaviorSubject<number>(Date.now());
  private maxTimestampSub: Subject<number> = new Subject();
  private minTimestampSub: BehaviorSubject<number> = new BehaviorSubject(0);
  private isPausedSub: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isLiveSub: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor() {
    this.init();
  }

  private init(): void {
    this.initMinTimestamp();
    const tick = interval(this.TICK_PERIOD);
    let maxProgressSub = tick.subscribe(() => {
      this.maxTimestampSub.next(Date.now());
      if (this.isPausedSub.getValue()) {
        this.isLiveSub.next(false);
      }
      if (this.isLiveSub.getValue()) {
        this.isPausedSub.next(false);
        this.currentTimestampSub.next(Date.now());
        this.maxTimestampSub.next(Date.now());
      } else {
        this.maxTimestampSub.next(Date.now());
        if (!this.isPausedSub.getValue()) {
          this.currentTimestampSub.next(this.currentTimestampSub.getValue() + this.TICK_PERIOD);
        }
      }
    })
    this.subscriptions.push(maxProgressSub);
  }

  private initMinTimestamp(): void {
    let now: Date = new Date();
    this.minTimestampSub.next(now.setHours(now.getHours() - 12));
  }

  public getMaxTimestamp(): Observable<number> {
    return this.maxTimestampSub.asObservable();
  }

  public getMinTimestamp(): Observable<number> {
    return this.minTimestampSub.asObservable();
  }

  public getCurrentTimestamp(): Observable<number> {
    return this.currentTimestampSub.asObservable();
  }

  public getIsPaused(): Observable<boolean> {
    return this.isPausedSub.asObservable();
  }

  public getIsLive(): Observable<boolean> {
    return this.isLiveSub.asObservable();
  }

  public setIsLive(value: boolean): void {
    this.isLiveSub.next(value);
  }

  public setIsPaused(value: boolean): void {
    this.isPausedSub.next(value);
  }

  public setCurrentTimestamp(value: number): void {
    this.currentTimestampSub.next(value);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
