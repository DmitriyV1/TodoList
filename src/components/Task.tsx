import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Card, Col } from "antd";
import styled from "styled-components";
import { useAppDispatch } from "../redux/hooks";
import {
  addFavoriteTodo,
  deleteTodo,
  editTodoStatus,
} from "../redux/todoSlice";

type Todo = {
  id: number;
  attributes: {
    title: string;
    description: string;
    status: string;
    favorite?: boolean;
  };
};

type Props = {
  active: number | string;
};

const StyledIcons = styled.div`
  > * {
    margin: auto 0.8em auto;
    font-size: 1.4em;
    :hover {
      cursor: pointer;
    }
  }
`;

const StyledStar = styled(StarOutlined)<Props>`
  color: ${(props) => (props.active ? "gold" : "black")};
`;

const StyledCard = styled(Card)<Props>`
  background-color: ${(props) =>
    props.active === "inactive" ? "LightGrey" : "white"};
`;

function Task({ item }: { item: Todo }) {
  const dispatch = useAppDispatch();
  const handleDelete = (id: number) => {
    dispatch(deleteTodo(id));
  };
  const handleActive = (item: Todo) => {
    dispatch(editTodoStatus(item));
  };
  const handleFavorite = (id: number) => {
    dispatch(addFavoriteTodo(id));
  };

  return (
    <Col span={6}>
      <StyledCard title={item.attributes.title} active={item.attributes.status}>
        <StyledIcons>
          <span onClick={() => handleActive(item)}>
            {item.attributes.status === "inactive" ? (
              <CloseOutlined />
            ) : (
              <CheckOutlined />
            )}
          </span>
          <DeleteOutlined onClick={() => handleDelete(item.id)} />
          <StyledStar
            onClick={() => handleFavorite(item.id)}
            active={item.attributes.favorite ? +true : +false}
          />
        </StyledIcons>
      </StyledCard>
    </Col>
  );
}

export default Task;
