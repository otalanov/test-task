import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {interval, Subject, Subscription} from "rxjs";
import {webSocket} from "rxjs/webSocket";
import {ProgressComponent} from "./progress/progress.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ProgressComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  title: string = 'client';
  ws: Subject<any> = webSocket('ws://localhost:4202/');
  dataCollection: any[] = [];
  dataCollectionFiltered: any[] = [];
  // dataCollectionFiltered$: Subject<any> = new Subject<any>();
  currentTimestamp$: Subject<number> = new Subject<number>();
  minTimestamp: number = 0;

  constructor() {
  }

  ngOnInit(): void {
    let currentTimestampSub = this.currentTimestamp$.subscribe(currentTimestamp => {
      // console.log('current ->', currentTimestamp)
      this.dataCollectionFiltered = this.dataCollection.filter(item => item.timestamp <= currentTimestamp)
    })
    this.subscriptions.push(currentTimestampSub);

    let wsSub: Subscription = this.ws.subscribe(data => {
      this.dataCollection.push(data);

      // basically every new item's timestamp will be bigger then previous, but will be helpful when pulling initial data
      this.minTimestamp = Math.min(...this.dataCollection.map(item => item.timestamp))
      console.log('min', this.minTimestamp)
      // this.dataCollection = [...this.dataCollection, data];
      console.log(this.dataCollection);
    });
    this.subscriptions.push(wsSub);
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
