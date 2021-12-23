import {Component, OnInit} from '@angular/core';
import {EventPayload} from '../../model/event-payload';
import {EventService} from '../../services/event-service';
import {Subscription} from 'rxjs';
import {ChatEvents} from '../../model/chat-events';

@Component({
  selector: 'lai-raw-output',
  templateUrl: './raw-output.component.html',
  styleUrls: ['./raw-output.component.scss']
})

export class RawOutputComponent implements OnInit {
  subscription: Subscription;
  rawMessages: EventPayload<any>[] = [];

  constructor(private eventService: EventService) {
    this.subscription = eventService.subscribe(ChatEvents.RAW, (message) => {
      this.rawMessages.push(message);
    });
  }

  ngOnInit(): void {
  }

}
