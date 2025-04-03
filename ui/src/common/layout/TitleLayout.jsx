/**
 *
 */

import styled from 'styled-components';

import { Col, Container, GridRow } from '../dsfr/fondamentaux';
import LinkButton from '../dsfr/custom/LinkButton';
import { Box } from '../Flexbox';
import useToggle from '../hooks/useToggle';


export function Back({ children, ...rest }) {
  return (
    <LinkButton icons={'arrow-left-line'} className={'fr-mb-3w'} {...rest}>
      {children}
    </LinkButton>
  );
}


const Message = styled('div')`
  margin-bottom: 1.5rem;
`;


export function TitleLayout({ title, details, getDetailsMessage, message, back, selector }) {

  const [showDetails, toggleDetails] = useToggle(false);

  return (
    <Container>
      {message && (
        <GridRow modifiers={'gutters'}>
          <Col>
            <Message>{message}</Message>
          </Col>
        </GridRow>
      )}
      {back && (
        <GridRow modifiers={'gutters'}>
          <Col>{back}</Col>
        </GridRow>
      )}
      <GridRow className={'fr-pb-1w'} style={{ marginTop: '3rem' }}>
        <Col modifiers={'12 md-8'}>
          <Box align={'baseline'}>
            {title && <h2>{title}</h2>}
            {details && (
              <LinkButton
                className={'fr-ml-2w'}
                modifiers={'sm icon-right'}
                icons={`arrow-${showDetails ? 'up' : 'down'}-s-line`}
                onClick={() => toggleDetails()}
              >
                {getDetailsMessage ? getDetailsMessage(showDetails) : 'Afficher les informations'}
              </LinkButton>
            )}
          </Box>
          {showDetails && details}
        </Col>
        {selector && <Col modifiers={'12 md-4'}>{selector}</Col>}
      </GridRow>
    </Container>
  );
}
