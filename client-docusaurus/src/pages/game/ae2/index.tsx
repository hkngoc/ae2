import clsx from 'clsx';
import Translate, { translate } from '@docusaurus/Translate';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import IconHome from '@theme/Icon/Home';
import {
  RoomListingData,
  useQueryRoomQuery,
} from '@site/src/services/game';

import BreadCrumbs from '../_components/BreadCrumbs';

import styles from './styles.module.css';

const TITLE = translate({message: 'Ancient Empires II'});

function GameHeader() {
  return (
    <div className="container">
      {/* <BreadCrumbs
        items={[
          { href: "/" },
          { href: "/game", content: "Game" },
          { content: "AE2" },
        ]}
      /> */}
      <section className="margin-bottom--lg text--center">
        <Heading as="h1">{TITLE}</Heading>
      </section>
    </div>
  );
}

function RoomList({ rooms }: { rooms: RoomListingData<any>[]}) {
  return (
    <div className="container">
      <Heading as="h2" className={styles.headingFavorites2}>
        All Games
      </Heading>

      <>
        <button>+</button>
      </>
      <table>
        <thead>
          <tr>
            <th>clients</th>
            <th>locked</th>
            <th>private</th>
            <th>maxClients</th>
            <th>metadata</th>
            <th>name</th>
            <th>publicAddress?</th>
            <th>processId</th>
            <th>roomId</th>
            <th>unlisted</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((item) => {
            const { 
              clients,
              locked,
              private: p,
              maxClients,
              metadata,
              name,
              publicAddress,
              processId,
              roomId,
              unlisted,
            } = item;

            return (
              <tr key={roomId}>
                <td>{clients}</td>
                <td>{locked}</td>
                <td>{p}</td>
                <td>{maxClients}</td>
                <td>{metadata}</td>
                <td>{name}</td>
                <td>{publicAddress}</td>
                <td>{processId}</td>
                <td>{roomId}</td>
                <td>{unlisted}</td>
                <td>
                  <Link
                    href={`./ae2/skirmish?roomId=${roomId}`}
                  >
                    Join
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function AE2() {
  const { data: rooms = [] } = useQueryRoomQuery({
    // game: "ae2",
  }, {
    pollingInterval: 5000,
  });

  return (
    <Layout
      title={TITLE}
    >
      <main className="margin-vert--lg">
        <GameHeader />
        <section className="margin-top--lg margin-bottom--xl">
          <div className={styles.showcaseFavorite2}>
            <RoomList rooms={rooms} />
          </div>
        </section>
      </main>
    </Layout>
  )
}
