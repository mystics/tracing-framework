/**
 * Copyright 2012 Google, Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Keyboard commanding support.
 *
 * @author benvanik@google.com (Ben Vanik)
 */

goog.provide('wtf.events.Keyboard');
goog.provide('wtf.events.KeyboardScope');

goog.require('goog.Disposable');
goog.require('goog.events.EventHandler');
goog.require('goog.ui.KeyboardShortcutHandler');
goog.require('wtf.events.EventEmitter');



/**
 * A keyboard commanding utility.
 * Allows the registration of global keyboard commands. As commands are
 * triggered events with the command name are emitted.
 *
 * @param {!Window} targetWindow Target window.
 * @constructor
 * @extends {wtf.events.EventEmitter}
 */
wtf.events.Keyboard = function(targetWindow) {
  goog.base(this);

  /**
   * Event handler.
   * @type {!goog.events.EventHandler}
   * @private
   */
  this.eh_ = new goog.events.EventHandler(this);
  this.registerDisposable(this.eh_);

  /**
   * Key handler.
   * @type {!goog.ui.KeyboardShortcutHandler}
   * @private
   */
  this.keyHandler_ = new goog.ui.KeyboardShortcutHandler(targetWindow.document);
  this.registerDisposable(this.keyHandler_);
  this.keyHandler_.setAlwaysPreventDefault(true);
  this.keyHandler_.setAlwaysStopPropagation(true);
  this.keyHandler_.setAllShortcutsAreGlobal(true);

  this.eh_.listen(
      this.keyHandler_,
      goog.ui.KeyboardShortcutHandler.EventType.SHORTCUT_TRIGGERED,
      this.keyPressed_,
      true);
};
goog.inherits(wtf.events.Keyboard, wtf.events.EventEmitter);


/**
 * Adds a command to be executed on the given key press.
 * @param {string} shortcut Shortcut string (like 'ctrl+g').
 * @param {!Function} callback Callback function.
 * @param {Object=} opt_scope Scope for the callback function.
 */
wtf.events.Keyboard.prototype.addShortcut = function(
    shortcut, callback, opt_scope) {
  // Support multi shortcuts.
  var shortcuts = shortcut.split('|');
  for (var n = 0; n < shortcuts.length; n++) {
    shortcut = shortcuts[n];
    if (!this.hasListeners(shortcut)) {
      this.keyHandler_.registerShortcut(shortcut, shortcut);
    }
    this.addListener(shortcut, callback, opt_scope);
  }
};


/**
 * Removes a shortcut command.
 * @param {string} shortcut Shortcut string (like 'ctrl+g').
 * @param {!Function} callback Callback function.
 * @param {Object=} opt_scope Scope for the callback function.
 */
wtf.events.Keyboard.prototype.removeShortcut = function(
    shortcut, callback, opt_scope) {
  // Support multi shortcuts.
  var shortcuts = shortcut.split('|');
  for (var n = 0; n < shortcuts.length; n++) {
    shortcut = shortcuts[n];
    this.removeListener(shortcut, callback, opt_scope);
    if (!this.hasListeners(shortcut)) {
      this.keyHandler_.unregisterShortcut(shortcut);
    }
  }
};


/**
 * Handles key press events.
 * @param {!goog.ui.KeyboardShortcutEvent} e Key press event.
 * @private
 */
wtf.events.Keyboard.prototype.keyPressed_ = function(e) {
  this.emitEvent(e.identifier);
};


/**
 * A map of all keyboards by window UID.
 * @type {!Object.<!wtf.events.Keyboard>}
 * @private
 */
wtf.events.Keyboard.keyboardInstances_ = {};


/**
 * Gets the keyboard for the given window, creating one if needed.
 * @param {Window=} opt_window Window to get the keyboard for.
 * @return {!wtf.events.Keyboard} Keyboard for the given window.
 */
wtf.events.Keyboard.getWindowKeyboard = function(opt_window) {
  var targetWindow = opt_window || goog.global;
  var uid = goog.getUid(targetWindow);
  var keyboard = wtf.events.Keyboard.keyboardInstances_[uid];
  if (!keyboard) {
    keyboard = new wtf.events.Keyboard(targetWindow);
    wtf.events.Keyboard.keyboardInstances_[uid] = keyboard;
  }
  return keyboard;
};



/**
 * Event utility for scoping keyboard shortcuts.
 * @param {!wtf.events.Keyboard} keyboard Keyboard instance.
 * @constructor
 * @extends {goog.Disposable}
 */
wtf.events.KeyboardScope = function(keyboard) {
  goog.base(this);

  /**
   * Target keyboard.
   * @type {!wtf.events.Keyboard}
   * @private
   */
  this.keyboard_ = keyboard;

  /**
   * A list of all shortcut listener tuples in the form of
   * [shortcut, callback, scope].
   * @type {!Array.<!Array>}
   * @private
   */
  this.listeners_ = [];
};
goog.inherits(wtf.events.KeyboardScope, goog.Disposable);


/**
 * @override
 */
wtf.events.KeyboardScope.prototype.disposeInternal = function() {
  for (var n = 0; n < this.listeners_.length; n++) {
    var listener = this.listeners_[n];
    this.keyboard_.removeShortcut(listener[0], listener[1], listener[2]);
  }
  goog.base(this, 'disposeInternal');
};


/**
 * Adds a command to be executed on the given key press.
 * @param {string} shortcut Shortcut string (like 'ctrl+g').
 * @param {!Function} callback Callback function.
 * @param {Object=} opt_scope Scope for the callback function.
 */
wtf.events.KeyboardScope.prototype.addShortcut = function(
    shortcut, callback, opt_scope) {
  this.listeners_.push([shortcut, callback, opt_scope]);
  this.keyboard_.addShortcut(shortcut, callback, opt_scope);
};
