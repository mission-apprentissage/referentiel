/**
 *
 */

import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useAllKeysPress } from '../hooks';
import { Col, Container, GridRow } from './fondamentaux';


const GridDisplayer = ({ className, fluid = false, gutters = true }) => {
  const isShorcutPress = useAllKeysPress({ userKeys: ['Alt', 'ArrowDown'] });
  const [showGrid, setShowGrid] = useState(false);
  useEffect(() => setShowGrid(isShorcutPress), [isShorcutPress]);

  if (!showGrid) {
    return <></>;
  }

  return (
    <div className={className}>
      <Container modifiers={fluid ? 'fluid' : ''}>
        <GridRow modifiers={gutters ? 'gutters' : ''}>
          <Col modifiers={'1'}>
            <div className="xfr-display-block xfr-display-sm-none">
              <span>xs</span>
            </div>
            <div className="xfr-display-none xfr-display-sm-block xfr-display-md-none">
              <span>sm</span>
            </div>
            <div className="xfr-display-none xfr-display-md-block xfr-display-lg-none">
              <span>md</span>
            </div>
            <div className="xfr-display-none xfr-display-lg-block xfr-display-xl-none">
              <span>lg</span>
            </div>
            <div className="xfr-display-none xfr-display-xl-block">
              <span>xl</span>
            </div>
          </Col>
          <Col modifiers={'1'}>
            <span />
          </Col>
          <Col modifiers={'1'}>
            <span />
          </Col>
          <Col modifiers={'1'}>
            <span />
          </Col>
          <Col modifiers={'1'}>
            <span />
          </Col>
          <Col modifiers={'1'}>
            <span />
          </Col>
          <Col modifiers={'1'}>
            <span />
          </Col>
          <Col modifiers={'1'}>
            <span />
          </Col>
          <Col modifiers={'1'}>
            <span />
          </Col>
          <Col modifiers={'1'}>
            <span />
          </Col>
          <Col modifiers={'1'}>
            <span />
          </Col>
          <Col modifiers={'1'}>
            <span />
          </Col>
          <Col modifiers={'1'}>
            <span />
          </Col>
        </GridRow>
      </Container>
    </div>
  );
};

export default styled(GridDisplayer)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  pointer-events: none;

  .fr-col {
    border: 1px solid grey;
  }

  .fr-grid-row--gutters {
    .fr-col {
      border: none;
    }
  }

  span {
    display: block;
    height: 100vh;
    background: rgba(135, 121, 121, 0.3);
    color: red;
  }
`;
