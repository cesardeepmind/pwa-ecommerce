import { useAtomValue } from 'jotai/utils'
import dynamic from 'next/dynamic'

import { Breadcrumb } from '@/components/@instantsearch/widgets/breadcrumb/breadcrumb'
import { InfiniteHits } from '@/components/@instantsearch/widgets/infinite-hits/infinite-hits'
import { NoResultsHandler } from '@/components/@instantsearch/widgets/no-results-handler/no-results-handler'
import { QueryRuleBanners } from '@/components/@instantsearch/widgets/query-rule-banners/query-rule-banners'
import { Container } from '@/components/container/container'
import { ProductHit } from '@/components/product/product-hit'
import { viewModeAtom } from '@/components/view-modes/view-modes'
import { configAtom } from '@/config/config'
import { useTailwindScreens } from '@/hooks/useTailwindScreens'
import type { SearchPageLayoutProps } from '@/layouts/search-page-layout'
import {
  getServerSidePropsPage,
  SearchPageLayout,
} from '@/layouts/search-page-layout'

const RefinementsBar = dynamic<any>(() =>
  import(
    /* webpackChunkName: 'search' */ '@/components/refinements-bar/refinements-bar'
  ).then((mod) => mod.RefinementsBar)
)

const RefinementsPanel = dynamic<any>(() =>
  import(
    /* webpackChunkName: 'refinements-panel' */ '@/components/refinements-panel/refinements-panel'
  ).then((mod) => mod.RefinementsPanel)
)

export default function Catalog(props: SearchPageLayoutProps) {
  const { breadcrumbAttributes, refinementsLayoutAtom } =
    useAtomValue(configAtom)
  const refinementsLayout = useAtomValue(refinementsLayoutAtom)
  const viewMode = useAtomValue(viewModeAtom)
  const { laptop } = useTailwindScreens()

  return (
    <SearchPageLayout {...props}>
      <Container className="flex flex-col gap-3 laptop:gap-10">
        <Breadcrumb attributes={breadcrumbAttributes} />

        <QueryRuleBanners limit={1} />

        <div className="flex flex-col laptop:flex-row">
          {(refinementsLayout === 'panel' || !laptop) && <RefinementsPanel />}

          <div className="flex-grow flex flex-col gap-2 laptop:gap-5">
            <RefinementsBar
              showWidgets={refinementsLayout === 'bar' && laptop}
            />

            <NoResultsHandler>
              <InfiniteHits
                hitComponent={ProductHit}
                viewMode={viewMode}
                showLess={true}
                showMore={true}
              />
            </NoResultsHandler>
          </div>
        </div>
      </Container>
    </SearchPageLayout>
  )
}

export const getServerSideProps = getServerSidePropsPage(
  Catalog as React.ComponentType
)
