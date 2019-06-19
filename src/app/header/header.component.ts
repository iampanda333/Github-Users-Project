import { Component, OnInit } from '@angular/core';
import { UsersService } from '../common/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  searchText: string;
  constructor(private userService: UsersService) { }

  ngOnInit() {
  }

  searchUsers() {
    if (this.searchText && this.searchText.trim()) {
      this.userService.userSearchText.next(this.searchText);
      this.userService.getUsers(1).subscribe();
    }
  }
}
