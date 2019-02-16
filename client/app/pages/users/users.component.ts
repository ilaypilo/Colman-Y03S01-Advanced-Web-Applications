import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastComponent } from '../../shared/toast/toast.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../shared/models/user.model';
import { ConfirmationDialogComponent } from '../../shared/confirm/confirmation-dialog';
import { MatDialog, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {

  title = 'Registered Users';
  users: User[] = [];
  isLoading = true;
  displayedColumns = ['username', 'email', 'role', 'action'];
  dataSource: any;
  hllCounter: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(
    public auth: AuthService,
    public toast: ToastComponent,
    private userService: UserService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      data => {
        this.users = data;
        this.dataSource = new MatTableDataSource<User>(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.getUsersDomainsCount();

      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  getUsersDomainsCount(){
    this.userService.getUsersDomainsCount().subscribe(
      data => {
        console.log('getUsersDomainsCount --> ' + data)
        this.hllCounter = data
      },
      error => console.log(error)
    );
  }

  deleteUser(user: User) {
    var dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: false });
    dialogRef.componentInstance.title = "Delete User"
    dialogRef.componentInstance.message = 'Are you sure you want to delete ' + user.username + '?'
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(user).subscribe(
          data => this.toast.open('user deleted successfully.', 'success'),
          error => console.log(error),
          () => this.getUsers()
        );
      }
    });
  }

  toggleAdmin(user: User) {
    let newRole = ""
    if (user.role=="user") {
      newRole = "admin"
    } else {
      newRole = "user"
    }
    var dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: false });
    dialogRef.componentInstance.title = "Change role"
    dialogRef.componentInstance.message = 'Change ' + user.username + ' role from "' + user.role + '" to "'+ newRole +'" ?'
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        user.role = newRole
        this.userService.editUser(user).subscribe(
          res => this.toast.open('Role changed saved!', 'success'),
          error => this.toast.open('Error changing role', 'danger')
        );
      }
    });
  }
}

