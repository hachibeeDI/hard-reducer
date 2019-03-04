import { ActionCreator, buildActionCreator, createReducer, Reducer } from "../";
const {
  createAction,
  createAsyncAction,
  createThunkAction
} = buildActionCreator({
  prefix: "counter/"
});

const reset = createAction();
const inc = createAction("inc", (val: number) => val);
const dec = createAction("dec", (val: number) => val);
// typed with ActionCreator
const foo: ActionCreator<{ foo: number }> = createAction("foo");

const thunked = createThunkAction(
  "thunked",
  async (input: { value: number }, dispatch, getState) => {
    dispatch(inc(input.value));
    dispatch(dec(input.value));
    dispatch(inc(input.value));
    return getState();
  }
);

const thunked2 = createThunkAction<
  any,
  { value: number },
  any,
  { ret: boolean }
>("thunked2", async (input, dispatch, getState) => {
  dispatch(inc(input.value));
  dispatch(dec(input.value));
  dispatch(inc(input.value));
  return { ret: true };
});

const thunkedNoArgs = createThunkAction(
  "thunked-noargs",
  async (_input: void, dispatch, getState) => {
    dispatch(inc(0));
    dispatch(dec(0));
    dispatch(inc(0));
    return getState();
  }
);

const _type: string = inc.type;

const incAsync = createAsyncAction("inc-async", async (val: number) => {
  return val;
});

inc(1); //=> { type: 'counter/inc', payload: 1 }

const asyncWithNoArgs = createAsyncAction(
  "async-noargs",
  async () => {
    return [1, 2, 3];
  }
);

asyncWithNoArgs();

type State = { value: number };

const initialState: State = { value: 0 };

const reducer: Reducer<State> = createReducer(initialState)
  // Handle `(State, Payload) => State` in matched context.
  .case(inc, (state, payload) => {
    return {
      value: state.value + payload
    };
  })
  .case(dec, (state, payload) => {
    const p = payload; //=> number
    return {
      value: state.value - p
    };
  })
  // require redux-thunk
  .case(incAsync.started, (state, payload) => {
    return state;
  })
  .case(incAsync.resolved, (state, payload) => {
    // $ExpectError
    // const p: string = payload
    return state;
  })
  .case(incAsync.rejected, (state, error) => {
    return state;
  })
  .case(reset, state => {
    return initialState;
  })
  .case(foo, (state, payload) => {
    // $ExpectError
    // const pe: { foo: string } = payload
    return initialState;
  })
  // .case('nop', (state, payload) => {
  //   return state
  // })
  .else((state, action) => {
    // console.log(action)
    return state;
  });

// Use it
const assert = require("assert");

const ret0 = reducer(initialState, inc(3));
const ret1 = reducer(ret0, dec(1));

assert(ret0.value === 3);
assert(ret1.value === 2);
assert(inc(1).type === "counter/inc");

thunked2({ value: 1 });
thunkedNoArgs();
