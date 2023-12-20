import {Component, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {Subject, Subscription} from "rxjs";
import {ProgressComponent} from "./progress/progress.component";
import {DataService} from "../services/data.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ProgressComponent],
  providers: [DataService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  title: string = 'client';
  dataCollection: any[] = [];
  dataCollectionFiltered: any[] = [];
  // dataCollectionFiltered$: Subject<any> = new Subject<any>();
  currentTimestamp$: Subject<number> = new Subject<number>();
  minTimestamp: number = 0;


  constructor(private dataService: DataService) {

  }

  ngOnInit(): void {
    let wsSub = this.dataService.fetchData()?.subscribe(data => {
      this.dataCollection.push(data);
      // basically every new item's timestamp will be bigger then previous, but will be helpful when pulling initial data
      this.minTimestamp = Math.min(...this.dataCollection.map(item => item.timestamp))
      console.log('min', this.minTimestamp)
      // this.dataCollection = [...this.dataCollection, data];
      console.log(this.dataCollection);
    });
    let currentTimestampSub = this.currentTimestamp$.subscribe(currentTimestamp => {
      // console.log('current ->', currentTimestamp)
      this.dataCollectionFiltered = this.dataCollection.filter(item => item.timestamp <= currentTimestamp)
    })
    this.subscriptions.push(currentTimestampSub);

    if (wsSub) {
      this.subscriptions.push(wsSub);
    }
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
