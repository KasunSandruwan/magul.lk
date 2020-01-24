import {Injectable} from '@angular/core';

import { AdminAuthService } from './admin-auth.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IPaginatedResult } from '../config/constants';

@Injectable({
  providedIn: 'root'
})
export class DealListService {
  constructor(private http: HttpClient, private authService: AdminAuthService) {
  }

 getDealList(limit: number, skip: number ,status:string) {

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.authToken.value
    });
    let url = `${environment.apiOrigin}/article/deal/list?`;
    url += `&limit=${limit}&skip=${skip}`;
    url += `&status=${status}`;
    url += `&apiKey=${environment.apiKey}`;
    return this.http.get<IPaginatedResult>(url, { headers }).toPromise();

  }

  getspecialistCategory(){

    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.authToken.value
    });
    const url = `${environment.apiOrigin}/app/specialistCategory/list?&apiKey=${environment.apiKey}`;
    return this.http.get<IPaginatedResult>(url, { headers }).toPromise();

  }


}
