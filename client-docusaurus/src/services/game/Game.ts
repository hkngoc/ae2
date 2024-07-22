import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface IRoomListingData {
  clients: number;
  locked: boolean;
  private: boolean;
  maxClients: number;
  metadata: any;
  name: string;
  publicAddress?: string;
  processId: string;
  roomId: string;
  unlisted: boolean;
  [property: string]: any;
}

export interface RoomListingData<Metadata = any> extends IRoomListingData {
  metadata: Metadata;
}

export const gameApi = createApi({
  reducerPath: "gameApi",
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/' }),
  endpoints: (builder) => ({
    queryRoom: builder.query<RoomListingData<any>[], Partial<IRoomListingData>>({
      query: (condition?: Partial<IRoomListingData>) => {
        return {
          url: `game/room`,
          params: condition,
        }
      },
    }),
  }),
});

export const {
  useQueryRoomQuery,
  useLazyQueryRoomQuery,
} = gameApi;
