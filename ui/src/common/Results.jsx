import { Col, GridRow } from './dsfr/fondamentaux';
import { useModal } from './dsfr/common/useModal';
import { Button } from './dsfr/elements/Button';
import styled from 'styled-components';
import { Box, Item } from './Flexbox';
import FullModal from './dsfr/custom/FullModal';

const SearchBox = styled(Box)`
  padding-bottom: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  margin-left: 0;
  box-shadow: inset 0 1px 0 0 var(--border-default-grey), 0 1px 0 0 var(--border-default-grey);
`;

export default function Results({ search, filters, results }) {
  const modal = useModal();

  return (
    <>
      <GridRow modifier={'gutters'}>
        <Col>
          {search && (
            <SearchBox justify={'between'}>
              <Item grow={1}>{search}</Item>
              <Item className={'xfr-display-block xfr-display-sm-none'}>
                <Button
                  title={'Filters'}
                  modifiers={'secondary'}
                  className={'fr-ml-1v'}
                  icons={'filter-line'}
                  aria-controls={modal.id}
                  onClick={modal.open}
                >
                  Menu
                </Button>
                <FullModal modal={modal}>{filters}</FullModal>
              </Item>
            </SearchBox>
          )}
        </Col>
      </GridRow>
      <GridRow modifiers={'gutters'}>
        {filters && (
          <Col modifiers={'sm-3'} className={'xfr-display-xs-none xfr-display-sm-block'}>
            {filters}
          </Col>
        )}
        <Col modifiers={`12 ${filters ? 'sm-9' : ''}`}>{results}</Col>
      </GridRow>
    </>
  );
}
