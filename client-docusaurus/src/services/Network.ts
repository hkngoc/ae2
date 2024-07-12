import {
  Client,
  Room,
} from 'colyseus.js'

export default class Network {
  private client: Client;

  constructor() {
    const protocol = window.location.protocol.replace('http', 'ws');
  }
}
