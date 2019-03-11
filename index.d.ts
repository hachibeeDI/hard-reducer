// Actions

export type Action<Payload> = {
  type: string;
  payload: Payload;
};

// Action Creator

// In some case i.e. type inference drops the type like `undefined | void | null | never` into `{}`
type InvalidArg = keyof {};

type ActionWorkerArgument<T = undefined> = T extends undefined
  ? []
  : keyof T extends InvalidArg
  ? []
  : [T];

export type Callable<Ret, Input = undefined> = {(...arg: ActionWorkerArgument<Input>): Ret};

export type ActionCreator<Payload = void, Input = undefined> = {
  type: string;
} & Callable<Action<Payload>, Input>;


export type AsyncActionCreator<Payload, Input = undefined> = {
  started: ActionCreator<void, Input>;
  resolved: ActionCreator<Payload, Input>;
  rejected: ActionCreator<Error, Input>;
} & Callable<Promise<Payload>, Input>;

export type ThunkActionCreator<Payload, Input> = {
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
  createAction<Payload = void>(t: string, fn: () => Payload): ActionCreator<Payload>;
  createAction<Payload, Input = Payload>(t: string, fn: (input: Input) => Payload): ActionCreator<Payload, Input>;

  createAsyncAction<Payload>(
    t: string | void,
    fn: () => Promise<Payload>
  ): AsyncActionCreator<Payload>;
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
