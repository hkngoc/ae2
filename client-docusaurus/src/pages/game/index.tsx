import {translate} from '@docusaurus/Translate';

import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import GameCards from './_components/GameCards';

const TITLE = translate({message: 'Docusaurus Site Showcase'});
const DESCRIPTION = translate({
  message: 'List of game are building with Docusaurus',
});

function GameHeader() {
  return (
    <section className="margin-top--lg margin-bottom--lg text--center">
      <Heading as="h1">{TITLE}</Heading>
      <p>{DESCRIPTION}</p>
    </section>
  );
}

export default function Game(): JSX.Element {
  return (
    <Layout
      title={TITLE}
      description={DESCRIPTION}
    >
      <main className="margin-vert--lg">
        <GameHeader />
        <div
          style={{display: 'flex', marginLeft: 'auto'}}
          className="container"
        >
        </div>
        <GameCards/>
      </main>
    </Layout>
  )
}
