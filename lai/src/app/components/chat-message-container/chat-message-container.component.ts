import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChatMessageModel} from '../../model/chat-message.model';
import {EventService} from '../../services/event-service';
import {Subscription} from 'rxjs';
import {ChatEvents} from '../../model/chat-events';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'lai-chat-message-container',
  templateUrl: './chat-message-container.component.html',
  styleUrls: ['./chat-message-container.component.scss'],
  animations: [trigger("moveIn", [
    transition(":enter", [
      style({transform: 'translateX(100%)', opacity: 0}),
      animate('210ms', style({transform: 'translateX(0)', opacity: 1}))
    ])
  ])]
})

export class ChatMessageContainerComponent implements OnInit, OnDestroy {
  chatMessages: ChatMessageModel[] = [];
  subscription: Subscription;

  constructor(private eventService: EventService) {
    this.subscription = this.eventService.subscribe(ChatEvents.CHAT_MESSAGE, (event) => {
      this.chatMessages.unshift(event.payload);
    })
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
