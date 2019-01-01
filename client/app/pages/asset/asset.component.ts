
import { Component, OnInit, ViewChild } from '@angular/core';
import 'rxjs/add/observable/of';
import { ToastComponent } from '../../shared/toast/toast.component';
import { AuthService } from '../../services/auth.service';
import { AssetService } from '../../services/asset.service';
import { CommentService } from '../../services/comment.service';
import { Asset } from '../../shared/models/asset.model';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationDialogComponent } from '../../shared/confirm/confirmation-dialog';
import { Comment } from '../../shared/models/comment.model';
import { AgmMap } from '@agm/core';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss']
})

export class AssetComponent implements OnInit {

  title = 'Registered Asset';
  asset: Asset;
  isLoading = true;
  id: string;
  sub: any;

  commentForm: FormGroup;
  commentTitle = new FormControl('', [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(30),
  ]);
  commentMessage = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100),
  ]);
  commentRate = new FormControl('', [
    Validators.required,
    //Validators.minLength(3),
    //Validators.maxLength(100),
  ]);

  constructor(
    private formBuilder: FormBuilder,
    public auth: AuthService,
    public toast: ToastComponent,
    private assetService: AssetService,
    private commentService: CommentService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public router: Router
  ) { }

  ngOnInit() {
    this.commentForm = this.formBuilder.group({
      title: this.commentTitle,
      message: this.commentMessage,
      rate: this.commentRate
    });
    
    this.sub = this.route.params.subscribe(params => {
        this.id = params['id'];
        this.getAsset(this.id);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getAsset(id) {
    this.assetService.getAsset(id).subscribe(
      data => {
        this.asset = data;
      },
      error => {
        console.log(error);
        this.router.navigate(['/notfound']);
      },
      () => this.isLoading = false,
    );
  }

  addComment() {
    this.commentForm.value.date = new Date();
    this.commentForm.value.user = this.auth.currentUser._id;
    this.commentForm.value.asset = this.id;
    this.commentService.addComment(this.commentForm.value).subscribe(
      res => this.toast.open('you successfully post a comment!', 'success'),
      error => this.toast.open('error posting a comment', 'danger'),
      () => this.getAsset(this.id)
    );
  }
  editComment(comment: Comment) {
    var dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: false });
    dialogRef.componentInstance.title = "Edit Comment"
    dialogRef.componentInstance.message = 'Are you sure you want to edit this comment?'
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        comment.date = new Date();
        this.commentService.editComment(comment).subscribe(
          data => this.toast.open('comment edited successfully.', 'success'),
          error => console.log(error),
          () => this.getAsset(this.id)
        );
      }
    });
  }
  
  deleteComment(comment: Comment) {
    var dialogRef = this.dialog.open(ConfirmationDialogComponent, { disableClose: false });
    dialogRef.componentInstance.title = "Delete Comment"
    dialogRef.componentInstance.message = 'Are you sure you want to delete this comment?'
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.commentService.deleteComment(comment).subscribe(
          data => this.toast.open('comment deleted successfully.', 'success'),
          error => console.log(error),
          () => this.getAsset(this.id)
        );
      }
    });
  }
}