/**
 * Copyright 2012 Google, Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Provider setup/registration utilities.
 *
 * @author benvanik@google.com (Ben Vanik)
 */

goog.provide('wtf.trace.providers');

goog.require('wtf.trace');
goog.require('wtf.trace.ConsoleProvider');
goog.require('wtf.trace.TimingProvider');


/**
 * Sets up all providers.
 */
wtf.trace.providers.setup = function() {
  var traceManager = wtf.trace.getTraceManager();
  traceManager.addProvider(new wtf.trace.ConsoleProvider());
  traceManager.addProvider(new wtf.trace.TimingProvider());
};
