import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { WebsocketService } from './websocket.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { AuthService } from './auth.service';

const CHAT_URL = 'ws://localhost:4200/ws';

export interface Message {
	type: string,
	message: string
}

@Injectable()
export class ChatService {
	public messages: Subject<Message>;

	constructor(wsService: WebsocketService, private auth: AuthService, public toast: ToastComponent) {
		this.messages = <Subject<Message>>wsService
			.connect(CHAT_URL)
			.map((response: MessageEvent): Message => {
				let data = JSON.parse(response.data);
				this.toast.open(data.message, 'primary');
				return {
					type: data.type,
					message: data.message
				}
			});
    }
}