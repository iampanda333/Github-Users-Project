import { Component, OnInit } from '@angular/core';
import { UsersService } from '../common/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  searchText: string;
  sortBy: string = "Sort By";
  constructor(private userService: UsersService) { }

  ngOnInit() {
  }

  searchUsers() {
    if (this.searchText && this.searchText.trim()) {
      //Search user without sorting
      this.userService.order = "";
      this.sortBy = "Sort By";
      this.userService.userSearchText.next(this.searchText);
      this.userService.getUsers(1).subscribe();
    }
  }
  sortByFollowers(order: string) {
    if (this.searchText && this.searchText.trim()) {
      // Search with sort by followers and update dropdown name
      this.sortBy = "Followers-" + order;
      this.userService.order = order;
      this.userService.userSearchText.next(this.searchText);
      this.userService.getUsers(1).subscribe();
    }
  }
}
