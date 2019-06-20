import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError, BehaviorSubject } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class UsersService {
  usersSubject = new Subject<any>();
  userSearchText = new BehaviorSubject<string>("");
  order: string;

  constructor(private http: HttpClient) { }

  getUsers(pageNumber: number) {
    let url = "https://api.github.com/search/users?q=" + this.userSearchText.getValue() + "&page=" + pageNumber + "&per_page=3&client_id=579da6fa8aba4e8ad57f&client_secret=ed81d34e7af835e05a0a5b120c7141128709ef1b";
    if (this.order) {
      url = url + "&sort=followers&order=" + this.order;
    }
    return this.http.get<any>(url)
      .pipe(
        map((result) => {
          this.usersSubject.next(result);
        }),
        retry(1),
        catchError(this.handleError)
      );
  }

  getUserRepository(userLogin: string): Observable<any> {
    return this.http.get("https://api.github.com/users/" + userLogin + "/repos?client_id=579da6fa8aba4e8ad57f&client_secret=ed81d34e7af835e05a0a5b120c7141128709ef1b").pipe(
      catchError(this.handleError)
    );
  }

  getUserDetails(url: string): Observable<any> {
    return this.http.get(url + "?client_id=579da6fa8aba4e8ad57f&client_secret=ed81d34e7af835e05a0a5b120c7141128709ef1b").pipe(
      catchError(this.handleError)
    );
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
