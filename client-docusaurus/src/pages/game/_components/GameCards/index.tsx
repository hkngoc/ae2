import type {ReactNode} from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import Heading from '@theme/Heading';

import FavoriteIcon from '../FavoriteIcon';
import GameCard from '../GameCard';

import {sortedUsers, type User} from '@site/src/data/users';

import styles from './styles.module.css';

const favoriteUsers = sortedUsers.filter((user) =>
  user.tags.includes('favorite'),
);

const otherUsers = sortedUsers.filter(
  (user) => !user.tags.includes('favorite'),
);

function HeadingFavorites() {
  return (
    <Heading as="h2" className={styles.headingFavorites}>
      <Translate id="showcase.favoritesList.title">Our favorites</Translate>
      <FavoriteIcon size="large" style={{marginLeft: '1rem'}} />
    </Heading>
  );
}

function HeadingAllSites() {
  return (
    <Heading as="h2">
      <Translate id="showcase.usersList.allUsers">All games</Translate>
    </Heading>
  );
}

function CardList({heading, items}: {heading?: ReactNode; items: User[]}) {
  return (
    <div className="container">
      {heading}
      <ul className={clsx('clean-list', styles.cardList)}>
        {items.map((item) => (
          <GameCard key={item.title} user={item} />
        ))}
      </ul>
    </div>
  );
}

export default function GameCards() {
  return (
    <section className="margin-top--lg margin-bottom--xl">
      <div className={styles.showcaseFavorite}>
        <CardList heading={<HeadingFavorites />} items={favoriteUsers} />
      </div>
      <div className="margin-top--lg">
        <CardList heading={<HeadingAllSites />} items={otherUsers} />
      </div>
    </section>
  )
}
