"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildActionCreator;

var _uuid = require("uuid");

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buildActionCreator() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var prefix = opts.prefix || "";

  function createAction() {
    var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _uuid2.default)();
    var fn = arguments[1];

    var type = prefix + t;
    var fsaFn = function fsaFn(input) {
      try {
        // covert input by fn modifier
        var _payload = fn ? fn(input) : input;
        return {
          type: type,
          payload: _payload
        };
      } catch (e) {
        return {
          type: type,
          error: true,
          payload: e
        };
      }
    };
    fsaFn.type = type;
    return fsaFn;
  }

  function createThunkAction() {
    var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _uuid2.default)();
    var fn = arguments[1];

    var type = prefix + t;
    var started = type + "/started";
    var resolved = type + "/resolved";
    var rejected = type + "/rejected";

    var fsaFn = function fsaFn(input) {
      return function (dispatch, getState) {
        dispatch({ type: started });
        return Promise.resolve(fn(input, dispatch, getState)).then(function (payload) {
          dispatch({ type: resolved, payload: payload });
          return payload;
        }).catch(function (error) {
          dispatch({ type: rejected, payload: error, error: true });
          return Promise.reject(error);
        });
      };
    };

    var retFn = function retFn(input) {
      return fsaFn(input);
    };
    retFn.started = started;
    retFn.resolved = resolved;
    retFn.rejected = rejected;
    return retFn;
  }

  function createAsyncAction() {
    var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _uuid2.default)();
    var fn = arguments[1];

    var type = prefix + t;
    var started = type + "/started";
    var resolved = type + "/resolved";
    var rejected = type + "/rejected";

    var fsaFn = function fsaFn(input) {
      return function (dispatch) {
        dispatch({ type: started });
        return Promise.resolve(fn(input)).then(function (ret) {
          dispatch({
            type: resolved,
            payload: ret
          });
          return ret;
        }).catch(function (err) {
          dispatch({
            type: rejected,
            payload: err,
            error: true
          });
          return Promise.reject(err);
        });
      };
    };

    var retFn = function retFn(input) {
      return fsaFn(input);
    };
    retFn.started = started;
    retFn.resolved = resolved;
    retFn.rejected = rejected;

    return retFn;
  }

  return { createAction: createAction, createAsyncAction: createAsyncAction, createThunkAction: createThunkAction, prefix: prefix };
}