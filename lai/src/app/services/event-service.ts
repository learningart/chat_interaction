import {Injectable} from '@angular/core';
import {ChatEvents} from '../model/chat-events';
import {filter, Subject, Subscription} from 'rxjs';
import {EventPayload} from '../model/event-payload';

@Injectable({providedIn: 'root'})
export class EventService {
  events: Subject<EventPayload<any>>;

  constructor() {
    this.events = new Subject<EventPayload<any>>();
  }

  subscribe(eventType: ChatEvents, subscribeCallback: (payload: EventPayload<any>) => void): Subscription {
    return this.events.asObservable().pipe(
      filter(eT => eT.eventType === eventType)).subscribe(subscribeCallback);
  }

  nextMessage(eventPayload: EventPayload<unknown>) {
    this.events.next(eventPayload);
  }
  
}
