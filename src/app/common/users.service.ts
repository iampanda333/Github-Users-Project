import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class UsersService {
    users = new Subject<any>();
    userSearchText: string;

    constructor(private http: HttpClient) {}

    getUsers(pageNumber: number) {
        return this.http.get<any>("https://api.github.com/search/users?q=" + this.userSearchText + "&page=" + pageNumber + "&per_page=3")
        .pipe(
            map( (result) => {
                this.users.next(result);
            }),
            retry(1),
            catchError(this.handleError)
        );
    }

    getUserRepository(userLogin: string): Observable<any> {
      return this.http.get("https://api.github.com/users/" + userLogin + "/repos").pipe(
        catchError(this.handleError)
      );
    }

    getUserDetails(url: string): Observable<any> {
      return this.http.get(url).pipe(
        catchError(this.handleError)
      );
    }

    handleError(error) {
      console.log(error)
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
    //    window.alert(errorMessage);
        return throwError(errorMessage);
      }
}
