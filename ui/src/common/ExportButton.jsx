/**
 *
 */

import DropdownButton from './dsfr/custom/DropdownButton';
import { Link } from './dsfr/elements/Link';
import { buildUrl } from './utils';
import config from '../config';


function ExportButton ({ label = 'Export', params = {}, ...rest }) {
  return (
    <DropdownButton
      {...rest}
      icons="file-download-line"
      modifiers={'secondary sm icon-left'}
      links={
        <>
          <Link
            as={'a'}
            modifiers={'icon-left sm'}
            href={buildUrl(config.apiUrl + '/organismes.csv', { ...params, page: 0, items_par_page: 100000 })}
            target={'_blank'}
          >
            CSV
          </Link>
          <Link
            as={'a'}
            modifiers={'icon-left sm'}
            href={buildUrl(config.apiUrl + '/organismes.xls', { ...params, page: 0, items_par_page: 100000 })}
            target={'_blank'}
          >
            XLS
          </Link>
        </>
      }
    >
      {label}
    </DropdownButton>
  );
}

export default ExportButton;
