import {Injectable, OnDestroy} from '@angular/core';
import {Observable, of, Subscriber, Subscription} from "rxjs";
import { EventTypes } from '../../../assets/enums/worker.enum';
import {NgxIndexedDBService} from "ngx-indexed-db";
import {environment} from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class DataService implements OnDestroy {

  protected socketURI: string = environment.serverAddress;

  private worker: Worker | undefined;
  // private workerObservable: Observable<any> | undefined;
  // private workerSubscriber: Subscriber<any> | undefined;
  private subscriptions: Subscription[] = [];

  constructor(private dbService: NgxIndexedDBService) {
    if (window.Worker) {
      this.worker = new Worker('../../assets/workers/socket-worker.js');
      this.worker.onmessage = (event: MessageEvent) => this.onMessage(event);
      // Init worker socket
      this.worker?.postMessage([EventTypes.INIT, this.socketURI]);
      // this.workerObservable = new Observable(subscriber => {
      //   this.workerSubscriber = subscriber;
      // });
    } else {
      // TODO(s1z): Notification to user!!!
      alert('Unfortunately your browser does not support Worker API!');
    }
  }

  // fetchData(): Observable<any> | undefined {
  //   return this.workerObservable;
  // }

  getData(storeName: string, indexName: string, keyRange: number): Observable<any> {
    // current implementation relies on the fact that we only need data <= than current timestamp
    // that is why we use upperbound. but this method should be more flexible to handle various kind of filters
    return this.dbService.getAllByIndex(storeName, indexName, IDBKeyRange.upperBound(keyRange));
  }

  onMessage(event?: MessageEvent): void {
    if (event?.data) {
      let sub = this.dbService.add('signals', JSON.parse(event.data)).subscribe((key) => {});
      this.subscriptions.push(sub)
    }
    // this.workerSubscriber?.next(event?.data);

  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe)
  }

}
