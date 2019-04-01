
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

import {
  AccessibilityConfig,
  Action,
  ButtonEvent,
  ButtonsConfig,
  ButtonsStrategy,
  ButtonType,
  Description,
  DescriptionStrategy,
  DotsConfig,
  GalleryService,
  Image,
  ImageModalEvent,
  KS_DEFAULT_BTN_CLOSE,
  KS_DEFAULT_BTN_DELETE,
  KS_DEFAULT_BTN_DOWNLOAD,
  KS_DEFAULT_BTN_EXTURL,
  KS_DEFAULT_BTN_FULL_SCREEN,
  PreviewConfig,
  LoadingConfig,
  LoadingType,
  CurrentImageConfig
} from '@ks89/angular-modal-gallery';


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

  imageIndex = 1;
  galleryId = 1;
  isPlaying = true;
  images: Image[] = []
  constructor(
    private formBuilder: FormBuilder,
    public auth: AuthService,
    public toast: ToastComponent,
    private assetService: AssetService,
    private commentService: CommentService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    public router: Router,
    private galleryService: GalleryService,
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
        this.title = this.asset.street + " " + this.asset.address_home_number + ", " + this.asset.city;
        this.images = [];
        var imgIndex = 0;
        data.info.images.forEach(element => {
          this.images.push(
            new Image(imgIndex++, {img: element})
          );
        });
      },
      error => this.router.navigate(['/notfound']),
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
          error => this.toast.open('error editing a comment', 'danger'),
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
          error => this.toast.open('error deleting a comment', 'danger'),
          () => this.getAsset(this.id)
        );
      }
    });
  }



  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
   // this variable is used only for example of auto navigation
   isShownAutoNavigate = false;

   onButtonBeforeHook(event: ButtonEvent) {
     console.log('onButtonBeforeHook ', event);
 
     if (!event || !event.button) {
       return;
     }
 
     // Invoked after a click on a button, but before that the related
     // action is applied.
     // For instance: this method will be invoked after a click
     // of 'close' button, but before that the modal gallery
     // will be really closed.
 
     if (event.button.type === ButtonType.DELETE) {
       // remove the current image and reassign all other to the array of images
 
       console.log('delete in app with images count ' + this.images.length);
 
       this.images = this.images.filter((val: Image) => event.image && val.id !== event.image.id);
     }
   }
 
   onButtonAfterHook(event: ButtonEvent) {
     console.log('onButtonAfterHook ', event);
 
     if (!event || !event.button) {
       return;
     }
 
     // Invoked after both a click on a button and its related action.
     // For instance: this method will be invoked after a click
     // of 'close' button, but before that the modal gallery
     // will be really closed.
   }
 
   onCustomButtonBeforeHook(event: ButtonEvent, galleryId: number | undefined) {
     console.log('onCustomButtonBeforeHook with galleryId=' + galleryId + ' and event: ', event);
     if (!event || !event.button) {
       return;
     }
     // Invoked after a click on a button, but before that the related
     // action is applied.
 
     if (event.button.type === ButtonType.CUSTOM) {
       console.log('adding a new random image at the end');
       this.addRandomImage();
 
       setTimeout(() => {
         this.galleryService.openGallery(galleryId, this.images.length - 1);
       }, 0);
     }
   }
 
   onCustomButtonAfterHook(event: ButtonEvent, galleryId: number | undefined) {
     console.log('onCustomButtonAfterHook with galleryId=' + galleryId + ' and event: ', event);
     if (!event || !event.button) {
       return;
     }
     // Invoked after both a click on a button and its related action.
   }
 
   onImageLoaded(event: ImageModalEvent) {
     // angular-modal-gallery will emit this event if it will load successfully input images
     console.log('onImageLoaded action: ' + Action[event.action]);
     console.log('onImageLoaded result:' + event.result);
   }
 
   onVisibleIndex(event: ImageModalEvent) {
     console.log('onVisibleIndex action: ' + Action[event.action]);
     console.log('onVisibleIndex result:' + event.result);
   }
 
   onIsFirstImage(event: ImageModalEvent) {
     console.log('onIsFirstImage onfirst action: ' + Action[event.action]);
     console.log('onIsFirstImage onfirst result:' + event.result);
   }
 
   onIsLastImage(event: ImageModalEvent) {
     console.log('onIsLastImage onlast action: ' + Action[event.action]);
     console.log('onIsLastImage onlast result:' + event.result);
   }
 
   onCloseImageModal(event: ImageModalEvent) {
     console.log('onClose action: ' + Action[event.action]);
     console.log('onClose result:' + event.result);
   }
 
   onShowAutoCloseExample(event: ImageModalEvent, galleryId: number) {
     console.log(`onShowAutoCloseExample with id=${galleryId} action: ` + Action[event.action]);
     console.log('onShowAutoCloseExample result:' + event.result);
     console.log('Starting timeout of 3 second to close modal gallery automatically');
     setTimeout(() => {
       console.log('setTimeout end - closing gallery with id=' + galleryId);
       this.galleryService.closeGallery(galleryId);
     }, 3000);
   }
 
   onShowAutoNavigateExample(event: ImageModalEvent, galleryId: number) {
     if (this.isShownAutoNavigate) {
       // this prevent multiple triggers of this method
       // this is only an example and shouldn't be done in this way in a real app
       return;
     }
     console.log(`onShowAutoNavigateExample with id=${galleryId} action: ` + Action[event.action]);
     console.log('onShowAutoNavigateExample result:' + event.result);
     console.log('Starting timeout of 3 second to navigate to image 0 and then to the next every second automatically');
     setTimeout(() => {
       this.isShownAutoNavigate = true;
       console.log('setTimeout end - navigating to index 0, gallery with id=' + galleryId);
       this.galleryService.navigateGallery(galleryId, 0);
 
       setTimeout(() => {
         console.log('setTimeout end - navigating to index 1, gallery with id=' + galleryId);
         this.galleryService.navigateGallery(galleryId, 1);
 
         setTimeout(() => {
           console.log('setTimeout end - navigating to index 2 (finished :) !), gallery with id=' + galleryId);
           this.galleryService.navigateGallery(galleryId, 2);
         }, 3000);
       }, 3000);
     }, 3000);
   }
 
   addRandomImage() {
     const imageToCopy: Image = this.images[Math.floor(Math.random() * this.images.length)];
     const newImage: Image = new Image(this.images.length - 1 + 1, imageToCopy.modal, imageToCopy.plain);
     this.images = [...this.images, newImage];
   }
 
   openModalViaService(id: number | undefined, index: number) {
     console.log('opening gallery with index ' + index);
     this.galleryService.openGallery(id, index);
   }
 
   trackById(index: number, item: Image) {
     return item.id;
   }
 
   autoPlayButton(id: number) {
     if (this.isPlaying) {
       this.galleryService.stop(id);
     } else {
       this.galleryService.play(id);
     }
     this.isPlaying = !this.isPlaying;
     return this.isPlaying;
   }
}