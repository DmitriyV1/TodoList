import { Layout } from "antd";

import styled from "styled-components";
import TaskTable from "./TaskTable";

const { Content } = Layout;

const StyledContent = styled(Content)`
  margin: 1rem;
`;

function Body() {
  return (
    <StyledContent>
      <TaskTable />
    </StyledContent>
  );
}

export default Body;
