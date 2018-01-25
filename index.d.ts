export type Action<T> = {
  type: string
  payload: T
}

export type ActionCreator<Input, Payload> = (input: Input) => Action<Payload>

export type Reducer<State> = {
  (state: State, action: any): State
  get: () => Reducer<State>
  case<Input, Payload>(
    actionFunc: ActionCreator<Input, Payload>,
    callback: (state: State, payload: Payload) => State
  ): Reducer<State>
}

export const buildActionCreator: (
  opt: { prefix?: string }
) => {
  createAction<Input, Payload>(
    t: string,
    fn: (input: Input) => Payload
  ): ActionCreator<Input, Payload>
  createSimpleAction(t: string): ActionCreator<void, void>
  createPromiseAction<Input, Payload>(
    t: string,
    fn: (input: Input) => Promise<Payload>
  ): ActionCreator<Input, Payload>
}

export const createReducer: <T>(t: T) => Reducer<T>
