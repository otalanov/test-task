import {Injectable} from '@angular/core';
import {DatabaseService} from "../database/database.service";
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalsService {
  private STORE_NAME: string = 'signals'
  private INDEX_NAME: string = 'timestamp'

  constructor(private databaseService: DatabaseService) {  }

  getSignals(keyRange: number): Observable<any> {
    return this.databaseService.getData(this.STORE_NAME, this.INDEX_NAME, keyRange)
  }

}
