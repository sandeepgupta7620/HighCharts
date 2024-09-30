

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable, tap } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private backendUrl = environment.backendUrl;
  constructor(private http : HttpClient) { }

  getMovies() : Observable<any>{
    return this.http.get<any>(this.backendUrl).pipe(
      tap((result)=>{
        console.log(result);
      })
    );
  }
}
