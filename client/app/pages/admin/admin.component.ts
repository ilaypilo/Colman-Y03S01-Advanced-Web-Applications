import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { ToastComponent } from '../../shared/toast/toast.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../shared/models/user.model';
import { ConfirmationDialogComponent } from '../../shared/confirm/confirmation-dialog';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent implements OnInit {

  title = 'Registered Users';
  users: User[] = [];
  isLoading = true;
  displayedColumns = ['username', 'email', 'role', 'action'];
  dataSource: any;
  
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
        this.dataSource = new TableDataSource(this.users);
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  deleteUser(user: User) {
    var dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: false });
    dialogRef.componentInstance.title = "Change role"
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

/**
 * Data source to provide what data should be rendered in the table. The observable provided
 * in connect should emit exactly the data that should be rendered by the table. If the data is
 * altered, the observable should emit that new set of data on the stream. In our case here,
 * we return a stream that contains only one set of data that doesn't change.
 */
export class TableDataSource extends DataSource<any> {
  constructor(private data: any) {
    super();
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<User[]> {
    return Observable.of(this.data);
  }

  disconnect() { }
}