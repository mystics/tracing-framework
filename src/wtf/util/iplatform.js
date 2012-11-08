/**
 * Copyright 2012 Google, Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Platform abstraction layer.
 *
 * @author benvanik@google.com (Ben Vanik)
 */

goog.provide('wtf.util.IPlatform');



/**
 * Platform abstraction interface.
 *
 * @interface
 */
wtf.util.IPlatform = function() {};


/**
 * Gets the directory the tool was launched from.
 * @return {string} Working directory.
 */
wtf.util.IPlatform.prototype.getWorkingDirectory = goog.nullFunction;


/**
 * Reads a file from the given path as a utf8 string.
 * @param {string} path File path.
 * @return {string?} File contents.
 */
wtf.util.IPlatform.prototype.readTextFile = goog.nullFunction;


/**
 * Reads a file from the given path as a binary blob.
 * @param {string} path File path.
 * @return {wtf.io.ByteArray?} File contents.
 */
wtf.util.IPlatform.prototype.readBinaryFile = goog.nullFunction;


/**
 * Writes a file to the given path as a utf8 string.
 * @param {string} path File path.
 * @param {string} contents File contents.
 */
wtf.util.IPlatform.prototype.writeTextFile = goog.nullFunction;


/**
 * Writes a file to the given path as a binary blob.
 * @param {string} path File path.
 * @param {!wtf.io.ByteArray} contents File contents.
 */
wtf.util.IPlatform.prototype.writeBinaryFile = goog.nullFunction;


/**
 * Gets a list of network interfaces as name/address values.
 * @param {!function(!Array.<{name: string, address: string}>)} callback
 *     Callback function.
 * @param {Object=} opt_scope Callback scope.
 */
wtf.util.IPlatform.prototype.getNetworkInterfaces = goog.nullFunction;


/**
 * Creates a TCP listen socket.
 * @param {number} port TCP port to listen on.
 * @param {string=} opt_hostname Hostname; omit to use 'localhost'.
 * @return {!wtf.net.ListenSocket} A new listen socket.
 */
wtf.util.IPlatform.prototype.createListenSocket = goog.nullFunction;
