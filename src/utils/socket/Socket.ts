/// <reference path='../../../@types/socket.io-msgpack-parser.d.ts' />

import { connect, Socket as SocketClient, ManagerOptions, SocketOptions } from 'socket.io-client';
import msgPackParser from 'socket.io-msgpack-parser';

type Callback<T> = (data: T) => void;

class Socket {
  private client: SocketClient;

  constructor(uri?: string, opts?: Partial<ManagerOptions & SocketOptions>) {
    this.client = connect(uri || 'http://localhost', {
      ...opts,
      parser: msgPackParser,
    });
  }

  public on<T>(name: string, callback: Callback<T>): void {
    this.client.on(name, callback);
  }

  public emit(name: string, data: unknown): void {
    this.client.emit(name, data);
  }

  public onConnect(callback: () => void): void {
    this.client.on('connect', callback);
  }

  public onConnectFailed(callback: () => void): void {
    this.client.on('connect_failed', callback);
  }

  public onConnectLost(callback: () => void): void {
    this.client.on('connect_timeout', callback);
  }

  public onReconnect(callback: () => void): void {
    this.client.on('reconnect', callback);
  }

  public onReconnecting(callback: () => void): void {
    this.client.on('reconnecting', callback);
  }

  public onConnectSaving(callback: () => void): void {
    this.client.on('reconnect_attempt', callback);
  }

  public onConnectSaved(callback: () => void): void {
    this.client.on('reconnect', callback);
  }

  public onConnectNotSaved(callback: () => void): void {
    this.client.on('reconnect_failed', callback);
  }

  public onError(callback: Callback<Record<string, unknown>>): void {
    this.client.on('error', callback);
  }

  public onDisconnect(reason: Callback<SocketClient.DisconnectReason>): void {
    this.client.on('disconnect', reason);
  }

  public disconnect(): void {
    this.client.disconnect();
  }

  public close(): void {
    this.client.close();
  }
}

export default Socket;
