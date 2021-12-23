import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ChatMessageModel} from '../../model/chat-message.model';
import {EmoteInformation} from '../../model/emote-information';

@Component({
  selector: 'lai-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})

export class ChatMessageComponent implements OnInit, OnChanges {
  @Input() chatMessage!: ChatMessageModel;
  messageWithEmotes: string = "";

  constructor() {
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if ('chatMessage' in changes) {
      this.prepareEmoteString();
    }
  }

  // emotes: 64138:0-8,40-48/25:19-23
  // SeemsGood and what Kappa do you do with SeemsGood that?

  prepareEmoteString() {
    if (!Boolean(this.chatMessage.emotes)) {
      this.messageWithEmotes = this.chatMessage.message;
      return;
    }
    let stringArr = this.chatMessage.emotes.indexOf('/') > -1 ? this.chatMessage.emotes.split("/") : [this.chatMessage.emotes];
    let emotesToProcess: EmoteInformation[] = []
    stringArr.forEach(emoteString => {
      const [id, locations] = emoteString.split(":");
      locations.split(",").forEach(emoteLocation => {
        const [begin, end] = emoteLocation.split("-");
        emotesToProcess.push({
          id,
          end: Number(end),
          begin: Number(begin),
          imageUrl: this.getImageUrl(id)
        })
      })
    });
    emotesToProcess.sort((emoteA, emoteB) => emoteA.begin - emoteB.begin);
    let curEmote = 0;
    this.chatMessage.message.split('').forEach((character, idx) => {

      if (idx > emotesToProcess[curEmote]?.end) {
        this.messageWithEmotes += ` <img src="${emotesToProcess[curEmote].imageUrl}">`
        curEmote++;
      }
      if (!(idx >= emotesToProcess[curEmote]?.begin && idx <= emotesToProcess[curEmote]?.end))
        this.messageWithEmotes += character;
    })

    console.log(this.messageWithEmotes);

  }

  private getImageUrl(emoteId: string) {
    return `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/dark/1.0`
  }


}
