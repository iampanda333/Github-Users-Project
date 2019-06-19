import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../common/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, OnDestroy {
  users: any;
  repositories: any;
  private subscription: Subscription;
  private textSearchSubscription: Subscription;
  //private errorSubscription: Subscription;
  constructor(private usersService: UsersService) { }
  totalPages: number;
  currentPage: number = 1;
  visiblePageArray: number[];
  lastPage: number = 0;
  openCollapse: string = "";
  //errorMessage: string;

  ngOnInit() {
    this.subscription = this.usersService.users.subscribe(
      (users: any) => {
        this.users = users;
        console.log(users);
        this.users.items.map(user => {
          console.log(user)
          this.usersService.getUserDetails(user['url']).subscribe(
            userDetail => {
              console.log(userDetail)
              user['detail'] = userDetail
            }
          )
        })
        this.totalPages = Math.ceil(users.total_count / 3);
        console.log(this.totalPages);
        this.pageCalculation(this.totalPages, this.currentPage);
      }
    );
    this.textSearchSubscription = this.usersService.userSearchText.subscribe(
      () => {
        this.currentPage = 1;
      }
    );
    // this.errorSubscription = this.usersService.errorSubject.subscribe(
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }

  getNewPageData(pageNumber) {
    this.currentPage = pageNumber;
    this.usersService.getUsers(pageNumber).subscribe();
  }

  pageCalculation(totalPages: number, currentPage: number) {
    if (totalPages < 5) {
      this.lastPage = 0;
      this.visiblePageArray = this.createVisibleArray(currentPage, totalPages);
    } else {
      if (currentPage < 3) {
        this.lastPage = totalPages;
        this.visiblePageArray = this.createVisibleArray(1, 3);
      } else if ((currentPage + 3) > totalPages) {
        this.lastPage = 0;
        this.visiblePageArray = this.createVisibleArray(totalPages - 3, totalPages);
      } else {
        this.lastPage = totalPages;
        this.visiblePageArray = this.createVisibleArray(currentPage - 1, currentPage + 1);
      }
    }
  }

  createVisibleArray(start, end) {
    let arr = new Array(end - start + 1);
    for (let j = 0; j < arr.length; j++ , start++) {
      arr[j] = start;
    }
    return arr;
  }

  getUserRepository(userLogin: string) {
    this.openCollapse = userLogin;

    this.usersService.getUserRepository(userLogin).subscribe(
      (result: any) => {
        console.log(result);
        this.users.items.map((item) => {
          if (item['login'] === userLogin) {
            item['repositories'] = result
          }
        })
        this.repositories = result;
      }
    );

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.textSearchSubscription.unsubscribe();
    //this.errorSubscription.unsubscribe();
  }

}
