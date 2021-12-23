import {ChatEvents} from './chat-events';

export interface EventPayload<TPayload> {
  eventType: ChatEvents;
  payload: TPayload;
}
