import {Component} from '@angular/core';
import {TwitchChatService} from './services/twitch-chat.service';
import {EventService} from './services/event-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private twitchService: TwitchChatService) {
    twitchService.establishConnection();
  }

}
