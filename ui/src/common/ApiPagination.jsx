import { FirstPage, LastPage, NextPage, Page, Pagination, PreviousPage } from "./dsfr/elements/Pagination";
import useNavigation from "./hooks/useNavigation";

export default function ApiPagination({ pagination }) {
  let { params, buildUrl } = useNavigation();
  let nextPage = pagination.page + 1;
  let previousPage = pagination.page - 1;

  function to(data = {}) {
    return {
      to: buildUrl(window.location.pathname, { ...params, ...data }),
      onClick: () => window.scrollTo(0, 0),
    };
  }

  if (pagination.total === 0) {
    return <div />;
  }

  return (
    <Pagination>
      <FirstPage {...to({ page: 1 })} />
      <PreviousPage disabled={previousPage < 1} {...to({ page: previousPage })} />
      <Page aria-current="page" {...to()}>
        {pagination.page}/{pagination.nombre_de_page}
      </Page>
      <NextPage disabled={nextPage > pagination.nombre_de_page} {...to({ page: nextPage })} />
      <LastPage {...to({ page: pagination.nombre_de_page })} />
    </Pagination>
  );
}
