import { useMemo } from 'react';

import Link from "@docusaurus/Link";
import IconHome from '@theme/Icon/Home';

type BreadCrumbItem = {
  href?: string;
  content?: string | JSX.Element;
}

type BreadCrumbsProps = {
  items: BreadCrumbItem[];
}

function BreadCrumbs({ items }: BreadCrumbsProps) {
  const length = useMemo(() => {
    return items.length;
  }, [items]);

  return (
    <nav className="theme-doc-breadcrumbs breadcrumbsContainer_node_modules-@docusaurus-theme-classic-lib-theme-DocBreadcrumbs-styles-module">
      <ul className="breadcrumbs">

        {
          items.map((item, index) => {
            const {
              href,
              content,
            } = item;

            if (index < length - 1) {
              return (
                <li
                  key={index}
                  className="breadcrumbs__item"
                >
                  <Link
                    href={href}
                    className="breadcrumbs__link"
                  >
                    {
                      href === "/" ? (
                        <IconHome className="breadcrumbHomeIcon_node_modules-@docusaurus-theme-classic-lib-theme-DocBreadcrumbs-Items-Home-styles-module" />
                      ) : (
                        content
                      )
                    }
                  </Link>
                </li>
              )
            }

            return (
              <li
                key={index}
                className="breadcrumbs__item breadcrumbs__item--active"
              >
                <span className="breadcrumbs__link">{content}</span>
              </li>
            )
          })
        }
      </ul>
    </nav>
  )
}

export default BreadCrumbs;
