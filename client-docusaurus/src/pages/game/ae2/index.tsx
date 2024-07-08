import {translate} from '@docusaurus/Translate';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Breadcrums from '@theme/DocBreadcrumbs';

const TITLE = translate({message: 'Docusaurus Site Showcase'});
const DESCRIPTION = translate({
  message: 'List of websites people are building with Docusaurus',
});

function GameHeader() {
  return (
    <section className="margin-top--lg margin-bottom--lg text--center">
      <Heading as="h1">{TITLE}</Heading>
      <p>{DESCRIPTION}</p>
    </section>
  );
}

export default function AE2() {
  return (
    <Layout
      title={TITLE}
      description={DESCRIPTION}
    >
      <main className="margin-vert--lg">
        <GameHeader />
      </main>
    </Layout>
    
  )
}
