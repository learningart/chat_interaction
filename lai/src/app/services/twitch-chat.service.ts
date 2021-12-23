import {Injectable} from '@angular/core';
import {getAnonymousUser, twitchChatUrl} from '../utilities/credentials';
import {JustinCredentialsModel} from '../model/justin-credentials.model';
import {EventService} from './event-service';
import {ChatEvents} from '../model/chat-events';
import {Subscription} from 'rxjs';
import {ChatMessageModel} from '../model/chat-message.model';

@Injectable({providedIn: 'root'})
export class TwitchChatService {
  connection!: WebSocket;
  subscription: Subscription;
  channel: string = "";
  private anonymousUser: JustinCredentialsModel = getAnonymousUser();

  constructor(private eventService: EventService) {
    this.subscription = this.eventService.subscribe(ChatEvents.PING, (event) => {
      this.pongMessage();
    });
  }


  establishConnection(credentials: JustinCredentialsModel | null = null, channel: string = '#learningartlive') {
    if (this.connection && this.connection.OPEN)
      return;
    this.channel = TwitchChatService.ensureChannelPrefix(channel);
    // default to anonymous user
    if (!credentials) credentials = this.anonymousUser;
    this.connection = new WebSocket(twitchChatUrl);
    this.connection.onopen = (event) => {
      // TODO: include workflow for sending password
      this.connection.send(`NICK ${credentials?.username}`);
      this.connection.send('CAP REQ :twitch.tv/tags');
      this.connection.send(`JOIN ${this.channel}`);
    }

    this.connection.onmessage = (message) => {
      this.eventService.nextMessage({eventType: ChatEvents.RAW, payload: message.data});
      this.processMessage(message);
    }

  }

  static ensureChannelPrefix(channel: string): string {
    if (channel[0] !== '#')
      return "#" + channel;
    return channel;
  }

  // TODO: parse through the messages and send out the correct type.
  private processMessage(message: MessageEvent) {
    if (message.data.indexOf("PING :tmi.twitch.tv") > -1)
      this.eventService.nextMessage({eventType: ChatEvents.PING, payload: message.data});
    if (message.data.indexOf("PRIVMSG") > -1)
      this.eventService.nextMessage({eventType: ChatEvents.CHAT_MESSAGE, payload: this.parseChatMessage(message.data)})
  }

  private pongMessage() {
    this.connection.send(`PONG :tmi.twitch.tv`);
  }

  private parseChatMessage(rawMessage: string) {
    const regExp = new RegExp(`(?<=${this.channel} :).*`, "gi");
    const userMessageIndex = rawMessage.search(regExp);
    const userMessage = rawMessage.slice(userMessageIndex, rawMessage.length);
    const metadata = rawMessage.slice(0, userMessageIndex).split(";").reduce((tuples, next) => {
      const [k, v] = next.split("=");
      tuples.push([k, v]);
      return tuples;
    }, [] as any[]);
    return {
      message: userMessage,
      color: this.pick('color', metadata),
      badges: this.pick('@badge-info', metadata),
      firstMessage: Boolean(this.pick('first-message', metadata)),
      displayName: this.pick('display-name', metadata),
      emotes: this.pick('emotes', metadata),
      isReply: Boolean(this.pick('reply-parent-display-name', metadata)),
      replyDisplayName: this.pick('reply-parent-display-name', metadata),
      isSubscriber: Boolean(Number(this.pick('subscriber', metadata)))
    } as ChatMessageModel
  }

  private pick(key: string, fromTuples: any[][]) {
    let tuple = fromTuples.find(e => e[0].toLowerCase() == key.toLowerCase());
    return tuple?.[1] ?? ""
  }

}
