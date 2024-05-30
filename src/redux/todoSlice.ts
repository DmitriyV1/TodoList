import {
  PayloadAction,
  UnknownAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

const JWT_TOKEN =
  "a56017bfd8f1a9d1c8d012e881ef7df90ddc4e3d74e61a27b82fa975cfe37571fcb0e7617258e871291c4315b68c1c410274fb19269becf5dae7b5372d611d66c605c701817bd70f8fcd39aa44973e95fb1dff1b36e3271ba4bf890e074e52d9b9feddcee0947e588d7b5f6eef4bd4ead3993c6ee7b35ffddf22012c2b5589ed";

type Todo = {
  id: number;
  attributes: {
    title: string;
    description: string;
    status: string;
    favorite?: boolean;
  };
};

type TodoState = {
  list: Todo[];
  sortedList: Todo[];
  loading: boolean;
  error: string | null;
};

export const fetchTodos = createAsyncThunk<Todo[]>(
  "todos/fetchTodos",
  async function (_, { rejectWithValue }) {
    const resp = await fetch(`https://cms.dev-land.host/api/tasks`, {
      headers: {
        Authorization: `Bearer ${JWT_TOKEN}`,
      },
    });

    if (!resp.ok) {
      return rejectWithValue("Problem with getting data");
    }
    const data = await resp.json();
    return data.data;
  }
);

export const addNewTodo = createAsyncThunk<
  Todo,
  string,
  { rejectValue: string }
>("todos/addNewTodo", async function (text, { rejectWithValue }) {
  const newTodo = {
    title: text,
    description: "any",
    status: "active",
  };

  const resp = await fetch(`https://cms.dev-land.host/api/tasks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${JWT_TOKEN}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ data: newTodo }),
  });

  if (!resp.ok) {
    return rejectWithValue("Failed to upload new Todo");
  }

  const data = await resp.json();
  return data.data;
});

export const deleteTodo = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("todos/deleteTodo", async function (id, { rejectWithValue }) {
  const resp = await fetch(`https://cms.dev-land.host/api/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${JWT_TOKEN}`,
    },
  });

  if (!resp.ok) {
    return rejectWithValue("Failed to delete Todo");
  }
  const data = await resp.json();
  return data.data.id;
});

export const editTodoStatus = createAsyncThunk<
  number,
  Todo,
  { rejectValue: string }
>("todos/editTodoStatus", async function (item, { rejectWithValue }) {
  const newTodo = {
    title: item.attributes.title,
    description: item.attributes.description,
    status: item.attributes.status === "inactive" ? "active" : "inactive",
  };

  const resp = await fetch(`https://cms.dev-land.host/api/tasks/${item.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${JWT_TOKEN}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ data: newTodo }),
  });

  if (!resp.ok) {
    return rejectWithValue("Failed to update status");
  }
  const data = await resp.json();
  return data.data.id;
});

const initialState: TodoState = {
  list: [],
  sortedList: [],
  loading: false,
  error: null,
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addFavoriteTodo(state, action: PayloadAction<number>) {
      const selectedItem = state.list.find(
        (todo) => todo.id === action.payload
      );

      if (selectedItem) {
        selectedItem.attributes.favorite = !selectedItem.attributes.favorite;
      }
    },
    filterTodos(state, action: PayloadAction<string>) {
      state.sortedList = [];
      switch (action.payload) {
        case "Favorite":
          state.sortedList = state.list.filter(
            (todo) => todo.attributes.favorite
          );
          break;
        case "Completed":
          state.sortedList = state.list.filter(
            (todo) => todo.attributes.status === "inactive"
          );
          break;
        case "Incompleted":
          state.sortedList = state.list.filter(
            (todo) => todo.attributes.status !== "inactive"
          );
          break;
        case "All":
          state.sortedList = state.list;
          break;

        default:
          state.sortedList = state.list.filter((todo) =>
            todo.attributes.title.includes(action.payload)
          );
          break;
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchTodos.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
    });
    builder.addCase(fetchTodos.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(addNewTodo.fulfilled, (state, action) => {
      state.list.push(action.payload);
    });
    builder.addCase(deleteTodo.fulfilled, (state, action) => {
      state.list = state.list.filter((todo) => todo.id !== action.payload);
    });
    builder.addCase(editTodoStatus.fulfilled, (state, action) => {
      const selectedItem = state.list.find(
        (todo) => todo.id === action.payload
      );
      if (selectedItem) {
        selectedItem.attributes.status =
          selectedItem.attributes.status === "inactive" ? "active" : "inactive";
      }
    });
    builder.addMatcher(isError, (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    });
  },
});

export const { addFavoriteTodo, filterTodos } = todoSlice.actions;

export default todoSlice.reducer;

function isError(action: UnknownAction) {
  return action.type.endsWith("rejected");
}
