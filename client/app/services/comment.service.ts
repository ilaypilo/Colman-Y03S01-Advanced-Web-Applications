import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Comment } from '../shared/models/comment.model';

@Injectable()
export class CommentService {

  constructor(private http: HttpClient) { }

  post(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>('/api/comment', comment);
  }

  editComment(comment: Comment): Observable<string> {
    return this.http.put(`/api/comment/${comment._id}`, comment, { responseType: 'text' });
  }

  deleteComment(comment: Comment): Observable<string> {
    return this.http.delete(`/api/comment/${comment._id}`, { responseType: 'text' });
  }

}
