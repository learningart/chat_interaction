import {JustinCredentialsModel} from '../model/justin-credentials.model';

export function getAnonymousUser(): JustinCredentialsModel {
  return {
    password: '',
    username: "justinfan1*********"
      .split('')
      .map(character => character === "*" ? (Math.floor(Math.random() * 9)).toString() : character)
      .join('')
  }
}


export const twitchChatUrl = "wss://irc-ws.chat.twitch.tv:443";
