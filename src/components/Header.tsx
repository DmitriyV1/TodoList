import { Layout, Button, Select, Input } from "antd";
import { useState } from "react";
import styled from "styled-components";
import { useAppDispatch } from "../redux/hooks";
import { addNewTodo, filterTodos } from "../redux/todoSlice";
const { Header: HeaderToChange } = Layout;

const StyledHeader = styled(HeaderToChange)`
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  border-bottom: 1px solid gray;

  > * {
    display: flex;
    margin: 1rem;
  }
`;

function Header() {
  const [newTodo, setNewTodo] = useState<string>();

  const dispatch = useAppDispatch();

  const handleChange = (value: string) => {
    dispatch(filterTodos(value));
  };

  const handleSearch = (value: string) => {
    if (value !== undefined) dispatch(filterTodos(value));
  };

  const handleNewTodo = function () {
    if (newTodo !== undefined) dispatch(addNewTodo(newTodo));
  };

  return (
    <StyledHeader>
      <span>
        <Input
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Поиск..."
        />
      </span>
      <span>
        <Input
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Новая задача"
        />
        <Button onClick={handleNewTodo} type="primary">
          Добавить
        </Button>
      </span>
      <Select
        defaultValue="All"
        style={{ width: 160 }}
        onChange={handleChange}
        options={[
          { value: "All", label: "Все" },
          { value: "Completed", label: "Выполненные" },
          { value: "Incompleted", label: "Активные" },
          { value: "Favorite", label: "Избранные" },
        ]}
      />
    </StyledHeader>
  );
}

export default Header;
