import { createContext, useReducer, useEffect, } from "react";

// ---------- TYPES ----------
export type User = {
  id: string;
  email: string;
  username: string;
  token: string;
};

export type AppState = {
  user: User;
  message: string;
  theme: "light" | "dark";
};

export type Action =
  | { type: "Login"; payload: User }
  | { type: "Logout"; payload: User } // could also reset to initial state
  | { type: "setTheme"; payload: "light" | "dark" }
  | { type: "displayMessage"; payload: string };

// ---------- INITIAL STATE ----------
export const InitialStates: AppState = {
  user: {
    id: "",
    email: "",
    username: "",
    token: "",
  },
  message: "yyy",
  theme: "light",
};

export const getInitialState = (): AppState => {
  const storedState = localStorage.getItem("appState");
  return storedState ? JSON.parse(storedState) : InitialStates;
};

// ---------- REDUCER ----------
export const UserReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "Login":
      return {
        ...state,
        user: action.payload,
      };
    case "Logout":
      return {
        ...state,
        user: InitialStates.user, // reset to empty user
      };
    case "setTheme":
      return {
        ...state,
        theme: action.payload,
      };
    case "displayMessage":
      return {
        ...state,
        message: action.payload,
      };
    default:
      return state;
  }
};

// ---------- CONTEXT ----------
type UserContextType = {
  state: AppState;
  dispatch: React.Dispatch<Action>;
};

export const UserContext = createContext<UserContextType>({
  state: InitialStates,
  dispatch: () => null,
});

// ---------- PROVIDER ----------
type UserProviderProps = {
  children: any;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [state, dispatch] = useReducer(UserReducer, getInitialState());

  useEffect(() => {
    localStorage.setItem("appState", JSON.stringify(state));
  }, [state]);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
