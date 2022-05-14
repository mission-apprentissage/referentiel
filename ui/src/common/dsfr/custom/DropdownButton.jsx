import styled from "styled-components";
import { Button } from "../elements/Button";
import useToggle from "../../hooks/useToggle";
import { Box } from "../../Flexbox";

const DropdownButton = styled(({ className, links, children, ...rest }) => {
  const [showContent, toggleShowContent] = useToggle(false);
  return (
    <div className={className}>
      <Button {...rest} onClick={() => toggleShowContent()} onBlur={() => setTimeout(toggleShowContent, 200)}>
        {children}
      </Button>
      {showContent && (
        <div className="dropdown-content">
          <Box direction={"column"}>{links}</Box>
        </div>
      )}
    </div>
  );
})`
  &&& {
    position: relative;
    display: inline-block;

    .dropdown-content {
      position: absolute;
      background-color: #fff;
      min-width: 160px;
      overflow: auto;
      box-shadow: 0 0 16px rgba(0, 0, 0, 0.08);
      z-index: 1000;

      a {
        background-image: none;
        padding-left: 1rem;
        padding-top: 0.5rem;
        text-decoration: none;
      }

      a:hover {
        border-radius: 0;
        background-color: #ebebeb;
        background-image: none;
      }
    }
  }
`;

export default DropdownButton;
