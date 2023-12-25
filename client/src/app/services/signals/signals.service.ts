import {Injectable} from '@angular/core';
import {DataService} from "../data/data.service";
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalsService {
  private STORE_NAME: string = 'signals'
  private INDEX_NAME: string = 'timestamp'

  constructor(private dataService: DataService) {
  }

  getSignals(keyRange: number): Observable<any> {
    return this.dataService.getData(this.STORE_NAME, this.INDEX_NAME, keyRange)
  }

}
