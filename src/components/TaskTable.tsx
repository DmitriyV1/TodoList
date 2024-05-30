import { Row } from "antd";
import { useAppSelector } from "../redux/hooks";

import Task from "./Task";

type Todo = {
  id: number;
  attributes: {
    title: string;
    description: string;
    status: string;
    favorite?: boolean;
  };
};

function TaskTable() {
  const todos = useAppSelector((state) => state.todos);

  const todoList = todos.list;
  const sortedTodoList = todos.sortedList;

  return (
    <>
      {todos.loading && <h1>Loading</h1>}
      {todos.error && <h1>{todos.error}</h1>}
      <Row gutter={[16, 16]}>
        {(sortedTodoList.length == 0 ? todoList : sortedTodoList).map(
          (item: Todo) => (
            <Task item={item} key={item.id} />
          )
        )}
      </Row>
    </>
  );
}

export default TaskTable;
