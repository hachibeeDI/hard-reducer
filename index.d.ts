// Actions

export type Action<Payload> = {
  type: string;
  payload: Payload;
};

// Action Creator

type CallableNoArg<Ret> = {(): Ret;}
type CallableWithArg<Ret = void, Input = void> = {(input: Input): Ret;}
export type Callable<Ret, Input> = Input extends void ? CallableNoArg<Ret> :
  Input extends never ? CallableNoArg<Ret>:
  CallableWithArg<Ret, Input>

export type ActionCreator<Payload = void, Input = void> = {
  type: string;
} & Callable<Action<Payload>, Input>;


export type AsyncActionCreator<Payload, Input = void> = {
  started: ActionCreator<void, Input>;
  resolved: ActionCreator<Payload, Input>;
  rejected: ActionCreator<Error, Input>;
} & Callable<Promise<Payload>, Input>;

export type ThunkActionCreator<Payload, Input = void> = {
  started: ActionCreator<void, Input>;
  resolved: ActionCreator<Payload, Input>;
  rejected: ActionCreator<Error, Input>;
} & Callable<Promise<Payload>, Input>;


// Reducer helper
export type Reducer<State> = {
  (state: State, action: any): State;
  get: () => Reducer<State>;

  case(actionFunc: string, reducer: (state: State, payload: any) => State): Reducer<State>;
  case<Input, Payload>(
    actionFunc: ActionCreator<Payload, Input>,
    reducer: (state: State, payload: Payload) => State
  ): Reducer<State>;

  else(fn: (s: State, a: Action<any>) => State): Reducer<State>;
};

// API

export const buildActionCreator: (opt?: {
  prefix?: string;
}) => {
  createAction<Payload = void, Input = Payload>(t?: string | void): ActionCreator<Payload, Input>;
  createAction<Payload = void>(t: string, fn: () => Payload): ActionCreator<Payload, void>;
  createAction<Payload, Input = Payload>(t: string, fn: (input: Input) => Payload): ActionCreator<Payload, Input>;

  createAsyncAction<Payload, Input>(
    t: string | void,
    fn: () => Promise<Payload>
  ): AsyncActionCreator<Payload, void>;
  createAsyncAction<Payload, Input>(
    t: string | void,
    fn: (input: Input) => Promise<Payload>
  ): AsyncActionCreator<Payload, Input>;

  createThunkAction<S, Input, A = any, R = any>(
    t: string | void,
    fn: (input: Input, dispatch: (a: A) => any, getState: () => S) => Promise<R>
  ): ThunkActionCreator<R, Input>;
};

export const createReducer: <T>(t: T) => Reducer<T>;
