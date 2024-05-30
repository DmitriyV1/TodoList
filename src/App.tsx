import { Layout } from "antd";
import Header from "./components/Header";
import Body from "./components/Body";
import styled from "styled-components";
import { useEffect } from "react";
import { fetchTodos } from "./redux/todoSlice";
import { useAppDispatch } from "./redux/hooks";

const StyledLayout = styled(Layout)``;

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  return (
    <StyledLayout>
      <Header />
      <Body />
    </StyledLayout>
  );
}

export default App;
