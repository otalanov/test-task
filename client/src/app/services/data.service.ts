import { Injectable } from '@angular/core';
import {Observable, Subscriber} from "rxjs";
import {EventTypes} from "../../assets/enums/worker.enum";


@Injectable({
  providedIn: 'root'
})
export class DataService {

  // TODO(s1z): Move socket URI to env file so we have different URIs for different builds!
  protected socketURI: string = "ws://localhost:4202/";

  private worker: Worker | undefined;
  private workerObservable: Observable<any> | undefined;
  private workerSubscriber: Subscriber<any> | undefined;

  constructor() {
    if (window.Worker) {
      this.worker = new Worker('assets/workers/socket-worker.js');
      this.worker.onmessage = (event: MessageEvent) => this.onMessage(event);
      // Init worker socket
      this.worker?.postMessage([EventTypes.INIT, this.socketURI]);
      this.worker.onmessage = (e) => this.onMessage(e);
      this.workerObservable = new Observable(subscriber => {
        this.workerSubscriber = subscriber;
      });
    } else {
      // TODO(s1z): Notification to user!!!
      alert('Unfortunately your browser does not support Worker API!');
    }
  }

  fetchData(): Observable<any> | undefined {
    return this.workerObservable;
  }

  onMessage(event: MessageEvent) {
    console.log('onMessageEvent ->', event);
  }

}
