import { forwardRef, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import qs from 'query-string';
import { first } from 'lodash';

import Layout from '@theme/Layout';
import { useLocation } from '@docusaurus/router';

import Phaser from 'phaser';
import { GridEngine } from 'grid-engine';

import BreadCrumbs from '../../_components/BreadCrumbs';

import { Loading } from './_scenes/Loading';
import { Game } from './_scenes/Game';

import Network from '@site/src/services/Network';
import { Room } from 'colyseus.js';

const useRoomId = (): string => {
  const { search} = useLocation();
  const {
    roomId,
  } = qs.parse(search);

  if (typeof roomId === "string") {
    return roomId;
  }

  return first(roomId);
}

function GameHeader({ roomId }: { roomId: string }) {
  return (
    <div className="container">
      <BreadCrumbs
        items={[
          { href: "/" },
          { href: "/game", content: "Game" },
          { href: "/game/ae2", content: "AE2" },
          { content: roomId },
        ]}
      />
    </div>
  );
}

const config = {
  width: "100%",
  height: "100%",
  type: Phaser.AUTO,
  scale: {
    // mode: Phaser.Scale.NONE,
    mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true
  },
  // pixelArt: true,
  parent: "game-container",
  fullscreenTarget: "game-container",
  backgroundColor: '#48C4F8',
  plugins: {
    scene: [
      {
        key: "gridEngine",
        plugin: GridEngine,
        mapping: "gridEngine",
      },
    ],
  },
  scene: [
    Loading,
    Game,
  ]
} as Phaser.Types.Core.GameConfig;

const StartGame = (parent) => {
  return new Phaser.Game({ ...config, parent });
}

interface IRefPhaserGame {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

type PhaserGameProps = {
  roomId: string;
}

const PhaserGame = forwardRef<IRefPhaserGame, PhaserGameProps>(function PhaserGame({ roomId }, ref) {
  const id = useMemo(() => {
    return `game-container-${roomId}`;
  }, [roomId]);

  const game = useRef<Phaser.Game | null>(null);

  useLayoutEffect(() => {
    if (game.current === null && id) {
      game.current = StartGame(id);

      if (typeof ref === "function") {
        ref({ game: game.current, scene: null });
      } else if (ref) {
        ref.current = { game: game.current, scene: null };
      }
    }

    return () => {
      if (game.current) {
        game.current.destroy(true);
        game.current = undefined;
      }
    }
  }, [ref, id]);

  return (
    <div
      id={id}
      style={{ aspectRatio: 16/10 }}
    />
  )
});

function GameContainer({ roomId }: { roomId: string }) {
  const networkRef = useRef<Network | null>(null);
  const roomRef = useRef<Room | null>(null);
  const phaserRef = useRef<IRefPhaserGame>();

  useEffect(() => {
    if (networkRef.current === null) {
      networkRef.current = new Network();
    }
  }, [roomId]);

  useEffect(() => {
    const joinGame = async () => {
      await roomRef.current?.leave();

      const room = await networkRef.current?.joinGame(roomId);

      console.log("join success", room);
      phaserRef.current?.game.registry.set("room", room);
      phaserRef.current?.game.scene.start("game");

      roomRef.current = room;
    }

    joinGame();

    return () => {
      roomRef.current?.leave();
      roomRef.current = null;
      networkRef.current?.dispose();
      networkRef.current = null;
    }
  }, [networkRef, roomId]);

  return (
    <div className="container">
      <PhaserGame
        ref={phaserRef}
        roomId={roomId}
      />
    </div>
  )
}

function Skirmish() {
  const roomId = useRoomId();

  return (
    <Layout
      title={roomId}
      noFooter={true}
    >
      <main className="margin-vert--lg">
        {/* <GameHeader roomId={roomId} /> */}
        {/* <section className="margin-vert--lg">
        </section> */}
        <GameContainer roomId={roomId} />
      </main>
    </Layout>
    
  )
}

export default Skirmish;
