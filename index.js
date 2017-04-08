'use strict';

const slice = Array.prototype.slice;

const notDefined = function(obj, key) { return obj[key] === undefined && obj.__lookupGetter__(key) === undefined && obj.__lookupSetter__(key) === undefined;}



/**
 * Copy
 * @param {Object} src
 * @param {Boolean} withAccess 
 */
function Copy(src, withAccess) {
    if (!(this instanceof Copy)) return new Copy(src, withAccess);
    this.src = src;
    this._withAccess = withAccess;
    this._unpick = false;
}

Copy.prototype.withAccess = function (w) {
    this._withAccess = w !== false;
    return this;
};

/**
 * pick keys in src
 */
Copy.prototype.pick = function (keys) {
    if (!Array.isArray(keys)) {
        keys = slice.call(arguments);
    }
    if (keys.length) {
        this.keys = keys;
        this._unpick = false;
    }
    return this;
};

/**
 * unpick keys in src
 */
Copy.prototype.unpick = function (keys) {
    if (!Array.isArray(keys)) {
        keys = slice.call(arguments);
    }
    if (keys.length) {
        this.keys = keys;
        this._unpick = true;
    }
    return this;
};

/**
 * copy src to target,
 * do not cover any property target has
 * @param {Object} to
 */

Copy.prototype.to = function (to) {
    to = to || {};
    if (!this.src) return to;
    var keys = Object.keys(this.src);
    if (!this._withAccess) {
        for (var i = 0; i < keys.length; i++) {
            key = keys[i];
            if(this.keys && this.keys.length){
                if (this._unpick === true ) {
                    if (this.keys.indexOf(key) !== -1)  continue;
                } else {
                    if (this.keys.indexOf(key) === -1)  continue;
                }
            }
            
            if (to[key] !== undefined) continue;
            to[key] = this.src[key];
        }
        return to;
    }

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
       if(this.keys && this.keys.length){
            if (this._unpick === true ) {
                if (this.keys.indexOf(key) !== -1)  continue;
            } else {
                if (this.keys.indexOf(key) === -1)  continue;
            }
        }
        if (!notDefined(to, key)) continue;
        var getter = this.src.__lookupGetter__(key);
        var setter = this.src.__lookupSetter__(key);
        if (getter) to.__defineGetter__(key, getter);
        if (setter) to.__defineSetter__(key, setter);

        if (!getter && !setter) {
            to[key] = this.src[key];
        }
    }
    return to;
};

/**
 * copy src to target,
 * override any property target has
 * @param {Object} to
 */

Copy.prototype.toCover = function (to) {
    var keys = Object.keys(this.src);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
       if(this.keys && this.keys.length){
            if (this._unpick === true ) {
                if (this.keys.indexOf(key) !== -1)  continue;
            } else {
                if (this.keys.indexOf(key) === -1)  continue;
            }
        }
        delete to[key];
        var getter = this.src.__lookupGetter__(key);
        var setter = this.src.__lookupSetter__(key);
        if (getter) to.__defineGetter__(key, getter);
        if (setter) to.__defineSetter__(key, setter);

        if (!getter && !setter) {
            to[key] = this.src[key];
        }
    }
};

Copy.prototype.override = Copy.prototype.toCover;

/**
 * append another object to src
 * @param {Obj} obj
 * @return {Copy}
 */

Copy.prototype.and = function (obj) {
    var src = {};
    this.to(src);
    this.src = obj;
    this.to(src);
    this.src = src;

    return this;
};


module.exports = Copy;