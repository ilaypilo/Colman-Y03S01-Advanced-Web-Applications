import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../material/material.module';

import { ToastComponent } from './toast/toast.component';
import { LoadingComponent } from './loading/loading.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { ConfirmationDialogComponent } from './confirm/confirmation-dialog';
import { TableFilter } from './table-filter/table-filter.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule
  ],
  exports: [
    // Shared Modules
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // Shared Components
    ToastComponent,
    LoadingComponent,
    PageHeaderComponent,
    TableFilter,
  ],
  declarations: [
    ToastComponent,
    LoadingComponent,
    PageHeaderComponent,
    ConfirmationDialogComponent,
    TableFilter
  ],
  providers: [
    ToastComponent
  ],
  entryComponents: [
    ConfirmationDialogComponent
  ]
})
export class SharedModule { }
