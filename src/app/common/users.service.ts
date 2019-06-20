import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, throwError, BehaviorSubject } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';
import { UserRepo } from '../model/user-repo.model';

@Injectable({
  providedIn: 'root'
})

export class UsersService {
  readonly CLIENT_SECRET = "ed81d34e7af835e05a0a5b120c7141128709ef1b";
  readonly CLIENT_ID = "579da6fa8aba4e8ad57f"
  readonly PER_PAGE = "3";
  readonly SORT = "followers";

  usersSubject = new Subject<any>();
  userSearchText = new BehaviorSubject<string>("");
  order: string;

  constructor(private http: HttpClient) { }

  // Get user list
  getUsers(pageNumber: number) {
    let url = "https://api.github.com/search/users";
    let httpParams = new HttpParams();
    httpParams = httpParams.set("client_id", this.CLIENT_ID);
    httpParams = httpParams.set("client_secret", this.CLIENT_SECRET);
    httpParams = httpParams.set("q", this.userSearchText.getValue());
    httpParams = httpParams.set("page", pageNumber.toString());
    httpParams = httpParams.set("per_page", this.PER_PAGE);

    if (this.order) {
      httpParams = httpParams.set("sort", this.SORT);
      httpParams = httpParams.set("order", this.order);
    }
    const options = {
      params: httpParams
    };
    return this.http.get<any>(url, options)
      .pipe(
        map((result) => {
          this.usersSubject.next(result);
        }),
        retry(1),
        catchError(this.handleError)
      );
  }

  // Get repository list for a user
  getUserRepository(userLogin: string): Observable<UserRepo[]> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set("client_id", this.CLIENT_ID);
    httpParams = httpParams.set("client_secret", this.CLIENT_SECRET);
    const options = {
      params: httpParams
    };
    return this.http.get<UserRepo[]>("https://api.github.com/users/" + userLogin + "/repos", options).pipe(
      catchError(this.handleError)
    );
  }

  // Get details of a user
  getUserDetails(url: string): Observable<any> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set("client_id", this.CLIENT_ID);
    httpParams = httpParams.set("client_secret", this.CLIENT_SECRET);
    const options = {
      params: httpParams
    };
    return this.http.get(url, options).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling
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
