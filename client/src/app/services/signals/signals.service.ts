import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {DataService} from "../data/data.service";
import {Observable, Subject, Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalsService {
  // private subscriptions: Subscription[] = []; //todo: create inheritive service that handles unsubscriptions for Services and components
  private static STORE_NAME: string = 'signals'
  private static INDEX_NAME: string = 'timestamp'

  constructor(private dataService: DataService) {
  }

  getSignals(keyRange: number): Observable<any> {
    return this.dataService.getData('signals', 'timestamp', keyRange)
  }

}
