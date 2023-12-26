import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, interval, Observable, Subscription} from "rxjs";
import {DatabaseService} from "../database/database.service";

@Injectable({
  providedIn: 'root'
})
export class DatetimeService implements OnDestroy {
  public TICK_PERIOD: number = 500;
  private subscriptions: Subscription[] = [];
  private currentTimestampSub: BehaviorSubject<number> = new BehaviorSubject<number>(Date.now());
  private maxTimestampSub: BehaviorSubject<number> = new BehaviorSubject(0);
  private minTimestampSub: BehaviorSubject<number> = new BehaviorSubject(0);
  private isPausedSub: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isLiveSub: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private MIN_TIMESTAMP_HOURS_OFFSET = 12;

  constructor(private databaseService: DatabaseService) {
    this.init();
  }

  private init(): void {
    this.initMinTimestamp();
    const tick = interval(this.TICK_PERIOD);
    let maxProgressSub = tick.subscribe(() => {
      this.maxTimestamp = Date.now();
      if (this.isPaused) {
        this.isLive = false;
      }
      if (this.isLive) {
        this.isPaused = false;
        this.syncFetchCurrentTimestamp();
        this.maxTimestamp = Date.now();
      } else {
        this.maxTimestamp = Date.now();
        if (!this.isPaused) {
          this.currentTimestamp = this.currentTimestamp + this.TICK_PERIOD;
        }
      }
    })
    this.subscriptions.push(maxProgressSub);
  }

  private set isPaused(value: boolean) {
    this.isPausedSub.next(value);
  }

  private set isLive(value: boolean) {
    this.isLiveSub.next(value);
  }

  private set maxTimestamp(value: number) {
    this.maxTimestampSub.next(value);
  }

  private set currentTimestamp(value: number) {
    this.currentTimestampSub.next(value);
  }

  private get isPaused(): boolean {
    return this.isPausedSub.getValue();
  }

  private get isLive(): boolean {
    return this.isLiveSub.getValue();
  }

  private get maxTimestamp(): number {
    return this.maxTimestampSub.getValue();
  }

  private get currentTimestamp(): number {
    return this.currentTimestampSub.getValue();
  }

  private initMinTimestamp(): void {
    let now: Date = new Date();
    this.minTimestampSub.next(now.setHours(now.getHours() - this.MIN_TIMESTAMP_HOURS_OFFSET));
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

  private syncFetchCurrentTimestamp(): void {
    this.currentTimestamp = this.databaseService.getCurrentTimestamp();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
