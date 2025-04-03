import styled from 'styled-components';

const Tooltip = styled(({ label, description, orientation = 'right', className }) => {
  return (
    <div className={className}>
      <span className={'icon fr-fi-error-warning-line fr-ml-1w'} />
      <div className={`tooltip-text tooltip-${orientation}`}>
        <div className={'fr-text--bold fr-mb-3v'}>{label}</div>
        <div>{description}</div>
      </div>
    </div>
  );
})`
  position: relative;

  .tooltip-text {
    visibility: hidden;
    position: absolute;
    display: inline;
    width: 500px;
    background-color: #fff;
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.08);
    color: #1e1e1e;
    padding: 20px;
    border-radius: 6px;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .tooltip-right {
    top: -5px;
    left: 125%;
  }

  &:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
  }

  .icon {
    color: #9c9c9c;

    &:before {
      font-size: 1rem;
    }
  }
`;

export default Tooltip;
