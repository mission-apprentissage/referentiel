import styled from "styled-components";
import cs from "classnames";

const Tooltip = styled(({ message, className, ...rest }) => {
  return <div title={message} className={cs(className, "fr-fi-error-warning-line", "fr-ml-1w")} {...rest} />;
})`
  color: #9c9c9c;
  &:before {
    font-size: 1rem;
  }
`;

export default Tooltip;
