import { forwardRef, useLayoutEffect, useRef } from 'react';
import qs from 'query-string';
import { first } from 'lodash';

import Layout from '@theme/Layout';
import { useLocation } from '@docusaurus/router';

import Phaser from 'phaser';

import BreadCrumbs from '../../_components/BreadCrumbs';
import { Game } from './_scenes/Game';

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
  // render: {
  //   antialias: false,
  //   pixelArt: true,
  //   roundPixels: true
  // },
  parent: "game-container",
  fullscreenTarget: "game-container",
  backgroundColor: '#48C4F8',
  scene: [
    Game,
  ]
} as Phaser.Types.Core.GameConfig;

const StartGame = (parent) => {
  return new Phaser.Game({ ...config, parent });
}

const PhaserGame = forwardRef(function PhaserGame(any, ref) {
  const game = useRef<Phaser.Game>();

  useLayoutEffect(() => {
    if (game.current === undefined) {
      game.current = StartGame("game-container");

      if (ref !== null) {
        // ref.current = { game: game.current, scene: null };
      }
    }

    return () => {
      if (game.current) {
        game.current.destroy(true);
        game.current = undefined;
      }
    }
  }, [ref]);

  return (
    <div id="game-container" style={{ aspectRatio: 16/9 }}></div>
  )
});

function GameContainer({ roomId }: { roomId: string }) {
  const phaserRef = useRef<Phaser.Game>();

  return (
    <div className="container">
      <PhaserGame ref={phaserRef} />
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
