"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createReducer;
function createReducer(initialState) {
  var handlerMap = new Map();
  var errorHandlerMap = new Map();
  var defaultFunc = null;

  var reducer = function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    if (action.payload instanceof Error && errorHandlerMap.has(action.type)) {
      var handler = errorHandlerMap.get(action.type);
      return handler(state, action.payload);
    } else if (handlerMap.has(action.type)) {
      var _handler = handlerMap.get(action.type);
      return _handler(state, action.payload);
    } else if (defaultFunc) {
      return defaultFunc(state, action);
    } else {
      return state;
    }
  };

  reducer.case = function (actionFunc, _reducer) {
    var type = typeof actionFunc === "string" ? actionFunc : actionFunc.type;
    if (handlerMap.has(type)) {
      throw new Error("hard-reducer: " + type + " already exists in cases");
    }
    handlerMap.set(type, _reducer);
    return reducer;
  };

  reducer.else = function (_reducer) {
    if (defaultFunc) {
      throw new Error("hard-reducer: default func already exsits");
    }
    defaultFunc = _reducer;
    return reducer;
  };

  return reducer;
}