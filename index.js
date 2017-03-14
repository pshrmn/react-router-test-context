'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var randomKey = function randomKey(keyLength) {
  return Math.random().toString(36).substr(2, keyLength);
};

var createDefaultMatch = function createDefaultMatch() {
  return { path: '/', url: '/', isExact: true, params: {} };
};

var createDefaultLocation = function createDefaultLocation() {
  return { pathname: '/', search: '', hash: '', key: randomKey(6) };
};

var createDefaultHistory = function createDefaultHistory(location) {
  return {
    action: 'POP',
    location: location || createDefaultLocation(),
    _listeners: [],
    listen: function listen(fn) {
      var _this = this;

      this._listeners.push(fn);
      return function () {
        _this._listeners = _this._listeners.filter(function (func) {
          return func !== fn;
        });
      };
    },
    push: function push(location) {
      this._notifyListeners(location);
    },
    replace: function replace(location) {
      this._notifyListeners(location);
    },
    _notifyListeners: function _notifyListeners(loc) {
      this._listeners.forEach(function (fn) {
        fn(loc);
      });
    },
    createHref: function createHref(loc) {
      if (typeof loc === 'string') {
        return loc;
      } else {
        return loc.pathname + (loc.search || '') + (loc.hash || '');
      }
    }
  };
};

var createRouterContext = function createRouterContext() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var userHistory = options.history,
      userLocation = options.location,
      userMatch = options.match,
      staticContext = options.staticContext;


  var match = _extends({}, createDefaultMatch(), userMatch);

  var location = _extends({}, createDefaultLocation(), userLocation);

  var history = _extends({}, createDefaultHistory(location), userHistory);

  return {
    router: {
      history: history,
      route: {
        match: match,
        location: location
      },
      staticContext: staticContext
    }
  };
};

exports.default = createRouterContext;
