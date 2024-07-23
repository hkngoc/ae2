import {
  Client,
  Room,
} from 'colyseus.js'

export default class Network {
  private client: Client;

  constructor() {
    const protocol = window.location.protocol.replace('http', 'ws');
    const endpoint = (window.location.href.indexOf("localhost") === -1)
    ? `${window.location.protocol.replace("http", "ws")}//${window.location.hostname}${(window.location.port && `:${window.location.port}`)}`
    : "ws://localhost:4000"
    this.client = new Client(endpoint)
  }

  async joinGame(roomId: string) {
    return await this.client.joinById(roomId);
  }
}
