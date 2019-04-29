'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _objectSpread = _interopDefault(require('./babel-runtime/helpers/objectSpread'));
var _toConsumableArray = _interopDefault(require('./babel-runtime/helpers/toConsumableArray'));
var _slicedToArray = _interopDefault(require('./babel-runtime/helpers/slicedToArray'));
var redux = require('./redux.min.js');
var _regeneratorRuntime = _interopDefault(require('./babel-runtime/regenerator/index.js'));
var _asyncToGenerator = _interopDefault(require('./babel-runtime/helpers/asyncToGenerator'));
var _defineProperty = _interopDefault(require('./babel-runtime/helpers/defineProperty'));
var _typeof = _interopDefault(require('./babel-runtime/helpers/typeof'));

/**
 * Create model's reducer
 *
 * @param {string} name
 * @param {object} state
 * @return {function} Reducer
 */
var createReducer = function createReducer(name, state) {
  state.loading = {};
  return function () {
    var currentState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : state;
    var action = arguments.length > 1 ? arguments[1] : undefined;

    var _action$type$split = action.type.split('/'),
        _action$type$split2 = _slicedToArray(_action$type$split, 1),
        modelName = _action$type$split2[0];

    if (modelName !== name) return currentState;
    return _objectSpread({}, currentState, action.payload);
  };
};

/**
 * 1. Error types
 */
var ERR = {
  // common
  NOT_STRING: function NOT_STRING(name) {
    return "'".concat(name, "' must be a string");
  },
  NOT_BOOLEAN: function NOT_BOOLEAN(name) {
    return "'".concat(name, "' must be a boolean");
  },
  NOT_ARRAY: function NOT_ARRAY(name) {
    return "'".concat(name, "' must be an array");
  },
  NOT_OBJECT: function NOT_OBJECT(name) {
    return "'".concat(name, "' must be an object");
  },
  // createStore
  DISPATCH: function DISPATCH() {
    return "Please do not use 'dispatch' directly in Retalk";
  },
  MODEL_NAME: function MODEL_NAME(name) {
    return "Illegal model name '".concat(name, "', duplicated with an action name");
  },
  // createReducer
  DEPRECATED: function DEPRECATED() {
    return "BREAKING CHANGES: 'reducers' was deprecated since v2.0.0, please don't use it";
  },
  MODEL: function MODEL(name) {
    return "'".concat(name, "' model must be { state: Object, actions: Object }");
  },
  // createActions
  ACTION_NAME: function ACTION_NAME(name, action) {
    return "Illegal action name '".concat(action, "' in ").concat(name, " model");
  },
  ACTION: function ACTION(name, action) {
    return "Illegal action '".concat(action, "' in ").concat(name, " model");
  },
  // checkDuplicate
  DUPLICATE: function DUPLICATE(name, type, key) {
    return "withStore: Duplicate '".concat(key, "' ").concat(type, " in ").concat(name, " and another model");
  },
  // withStore
  WITH_STORE: function WITH_STORE() {
    return 'Illegal model name passed to withStore';
  }
};
/**
 * 2. Detect an object
 *
 * @param {any} obj
 * @return {boolean}
 */

var isObject = function isObject(obj) {
  return _typeof(obj) === 'object' && obj !== null && !Array.isArray(obj);
};
/**
 * 3. Detect an async function
 *
 * @param {any} fn
 * @return {boolean}
 */

var isAsyncFn = function isAsyncFn(fn) {
  if (typeof fn !== 'function') return false;
  var str = fn.toString();
  // str.includes('async ') 是自己加的，可以支持不经过 babel 转换的原生 async/await
  return str.includes('regeneratorRuntime.mark(') || str.includes('_regenerator') || str.includes('.apply(') || str.includes('async ');
};
/**
 * 4. Check model
 *
 * @param {string} name
 * @param {object} model
 */

var checkModel = function checkModel(name, model) {
  if (typeof name !== 'string') throw new Error(ERR.NOT_STRING('name'));
  if (!isObject(model)) throw new Error(ERR.NOT_OBJECT('model'));
  var reducers = model.reducers,
      state = model.state,
      actions = model.actions;
  if (reducers !== undefined) throw new Error(ERR.DEPRECATED());

  if (!(Object.keys(model).length === 2 && isObject(state) && isObject(actions))) {
    throw new Error(ERR.MODEL(name));
  }
};
/**
 * 5. Create Proxy's handler
 *
 * @param {string} name
 * @param {function} getState
 * @param {function} dispatch
 * @param {object} [modelsProxy]
 * @return {object} handler
 */

var createHandler = function createHandler(name, getState, dispatch, modelsProxy) {
  return {
    get: function get(target, prop) {
      if (prop === 'state') return getState()[name];
      if (prop in target) return target[prop];

      if (prop in dispatch[name]) {
        Object.assign(target, dispatch[name]);
        return target[prop];
      }

      if (typeof modelsProxy !== 'undefined' && prop in modelsProxy) {
        Object.assign(target, modelsProxy);
        return target[prop];
      }

      return undefined;
    }
  };
};
/**
 * 6. Check duplicate keys
 *
 * @param {string} name
 * @param {string} type
 * @param {object} part
 * @param {object} all
 */

var checkDuplicate = function checkDuplicate(name, type, part, all) {
  var keys = Object.keys(part);
  if (type === 'state') keys = keys.filter(function (key) {
    return key !== 'loading';
  });
  keys.forEach(function (key) {
    if (key in all) throw new Error(ERR.DUPLICATE(name, type, key));
  });
};

/**
 * Format model's actions
 *
 * @param {string} name
 * @param {object} model
 * @param {function} getState
 * @param {function} dispatch
 * @param {function} theRealDispatch
 * @param {object} thisProxy
 */

var createActions = function createActions(name, model, getState, dispatch, theRealDispatch, thisProxy) {
  var state = model.state,
      actions = model.actions;
  var forbiddenNames = ['state', 'setState'].concat(_toConsumableArray(Object.keys(state)));
  var newActions = {};
  Object.entries(actions).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        actionName = _ref2[0],
        oldAction = _ref2[1];

    if (forbiddenNames.includes(actionName)) throw new Error(ERR.ACTION_NAME(name, actionName));
    if (typeof oldAction !== 'function') throw new Error(ERR.ACTION(name, actionName));

    var setState = function reducer(payload) {
      return theRealDispatch({
        type: "".concat(name, "/").concat(actionName),
        payload: payload
      });
    };

    var newAction = function action() {
      thisProxy.setState = setState;
      return oldAction.bind(thisProxy).apply(void 0, arguments);
    };
    if (!isAsyncFn(oldAction)) {
      newActions[actionName] = newAction;
    } else {
      state.loading[actionName] = false;

      var setLoading = function reducer(actionName, actionLoading) {
        return theRealDispatch({
          type: "".concat(name, "/").concat(actionName, "/SET_LOADING"),
          payload: {
            loading: _objectSpread({}, getState()[name].loading, _defineProperty({}, actionName, actionLoading))
          }
        });
      };

      newActions[actionName] =
      /*#__PURE__*/
      function () {
        var _asyncAction = _asyncToGenerator(
        /*#__PURE__*/
        _regeneratorRuntime.mark(function _callee() {
          var result,
              _args = arguments;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  setLoading(actionName, true);
                  _context.next = 3;
                  return newAction.apply(void 0, _args);

                case 3:
                  result = _context.sent;
                  setLoading(actionName, false);
                  return _context.abrupt("return", result);

                case 6:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function asyncAction() {
          return _asyncAction.apply(this, arguments);
        }

        return asyncAction;
      }();
    }
  });
  dispatch[name] = newActions;
};

/**
 * Create the Redux store
 *
 * @param {object} models
 * @param {object} options
 * @return {object} Store
 */

var createStore = function createStore(models) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // Check params
  if (!isObject(models)) throw new Error(ERR.NOT_OBJECT('models'));
  if (!isObject(options)) throw new Error(ERR.NOT_OBJECT('options'));
  var _options$useDevTools = options.useDevTools,
      useDevTools = _options$useDevTools === void 0 ? true : _options$useDevTools,
      _options$plugins = options.plugins,
      plugins = _options$plugins === void 0 ? [] : _options$plugins;
  if (typeof useDevTools !== 'undefined' && typeof useDevTools !== 'boolean') throw new Error(ERR.NOT_BOOLEAN('options.useDevTools'));
  if (typeof plugins !== 'undefined' && !Array.isArray(plugins)) throw new Error(ERR.NOT_ARRAY('options.plugins'));
  var modelEntries = Object.entries(models); // Check model, get action names

  var actionNames = [];
  modelEntries.forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        name = _ref2[0],
        model = _ref2[1];

    checkModel(name, model);
    actionNames = [].concat(_toConsumableArray(actionNames), _toConsumableArray(Object.keys(model.actions)));
  });
  actionNames = _toConsumableArray(new Set(actionNames)); // Check model name, create reducer

  var rootReducers = {};
  modelEntries.forEach(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        name = _ref4[0],
        model = _ref4[1];

    if (actionNames.includes(name)) throw new Error(ERR.MODEL_NAME(name));
    rootReducers[name] = createReducer(name, model.state);
  }); // Create store

  var composeEnhancers = useDevTools === true && redux.compose;
  var store = redux.createStore(redux.combineReducers(rootReducers), composeEnhancers(redux.applyMiddleware.apply(void 0, _toConsumableArray(plugins))));
  var theRealDispatch = store.dispatch;

  store.dispatch = function () {
    throw new Error(ERR.DISPATCH());
  };

  var getState = store.getState,
      dispatch = store.dispatch; // Format actions

  var modelsProxy = {};
  modelEntries.forEach(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 1),
        name = _ref6[0];

    modelsProxy[name] = new Proxy({}, createHandler(name, getState, dispatch));
  });
  modelEntries.forEach(function (_ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
        name = _ref8[0],
        model = _ref8[1];

    var thisProxy = new Proxy({}, createHandler(name, getState, dispatch, modelsProxy));
    createActions(name, model, getState, dispatch, theRealDispatch, thisProxy);
  }); // store.addModel

  store.addModel = function (name, model) {
    if (name in rootReducers) return;
    checkModel(name, model);
    actionNames = _toConsumableArray(new Set([].concat(_toConsumableArray(actionNames), _toConsumableArray(Object.keys(model.actions)))));
    if (actionNames.includes(name)) throw new Error(ERR.MODEL_NAME(name));
    rootReducers[name] = createReducer(name, model.state);
    store.replaceReducer(redux.combineReducers(rootReducers));
    modelsProxy[name] = new Proxy({}, createHandler(name, getState, dispatch));
    var thisProxy = new Proxy({}, createHandler(name, getState, dispatch, modelsProxy));
    createActions(name, model, getState, dispatch, theRealDispatch, thisProxy);
  };

  return store;
};
/**
 * Get mapState and mapActions for connect
 *
 * @param {string[]} names
 * @return {function[]} [mapState, mapActions]
 */


var withStore = function withStore() {
  for (var _len = arguments.length, names = new Array(_len), _key = 0; _key < _len; _key++) {
    names[_key] = arguments[_key];
  }

  var namesLength = names.length;
  if (namesLength === 0) throw new Error(ERR.WITH_STORE());
  var stateCount = 0;
  var actionsCount = 0;
  var mergedState = {
    loading: {}
  };
  var mergedActions = {};
  return [function (state) {
    names.forEach(function (name) {
      var modelState = state[name];

      if (stateCount < namesLength) {
        if (typeof name !== 'string' || !(name in state)) throw new Error(ERR.WITH_STORE());

        if (namesLength > 1) {
          checkDuplicate(name, 'state', modelState, mergedState);
        }

        stateCount += 1;
      }

      mergedState = _objectSpread({}, mergedState, modelState, {
        loading: _objectSpread({}, mergedState.loading, modelState.loading)
      });
    });
    return mergedState;
  }, function (dispatch) {
    names.forEach(function (name) {
      var modelActions = dispatch[name];

      if (namesLength > 1 && actionsCount < namesLength) {
        checkDuplicate(name, 'action', modelActions, mergedActions);
        actionsCount += 1;
      }

      mergedActions = _objectSpread({}, mergedActions, modelActions);
    });
    return mergedActions;
  }];
};

exports.createStore = createStore;
exports.withStore = withStore;
