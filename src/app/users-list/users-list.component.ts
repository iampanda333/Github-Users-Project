import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from '../common/users.service';
import { Subscription } from 'rxjs';
import { UserRepo } from '../model/user-repo.model';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, OnDestroy {
  users: any;
  repositories: any;
  totalPages: number;
  currentPage: number = 1;
  visiblePageArray: number[];
  lastPage: number = 0;
  openCollapse: string = "";
  // Subscription
  private userSubscription: Subscription;
  private textSearchSubscription: Subscription;

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.userSubscription = this.usersService.usersSubject.subscribe(
      (users: any) => {
        this.users = users;
        this.users.items.map(user => {
          this.usersService.getUserDetails(user['url']).subscribe(
            userDetail => {
              user['detail'] = userDetail;
              user['details_button'] = false;
            }
          )
        })
        this.totalPages = Math.ceil(users.total_count / 3);
        this.pageCalculation(this.totalPages, this.currentPage);
      }
    );
    this.textSearchSubscription = this.usersService.userSearchText.subscribe(
      () => {
        this.currentPage = 1;
      }
    );
  }

  // Update pagination data
  getNewPageData(pageNumber) {
    this.currentPage = pageNumber;
    this.usersService.getUsers(pageNumber).subscribe();
  }

  // Getting list of pages which will be displayed
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

  // Create array of page numbers
  createVisibleArray(start, end) {
    let arr = new Array(end - start + 1);
    for (let j = 0; j < arr.length; j++ , start++) {
      arr[j] = start;
    }
    return arr;
  }

  // Get repositories for a user
  getUserRepository(userLogin: string) {
    this.openCollapse = userLogin;
    let repo = this.users["items"].find(user => user.login === userLogin);
    if (!repo.hasOwnProperty("repositories")) {
      this.usersService.getUserRepository(userLogin).subscribe(
        (result: UserRepo[]) => {
          this.users.items.map((item) => {
            if (item['login'] === userLogin) {
              item['repositories'] = result;
              item['details_button'] = true;
            }
          })
          this.repositories = result;
        }
      );
    } else {
      repo['details_button'] = !repo['details_button']; 
    }
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.textSearchSubscription.unsubscribe();
  }

}
