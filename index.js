/*
    Copyright 2011 Emilis Dambauskas

    This file is part of OFS-Feeds.

    OFS-Feeds is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    OFS-Feeds is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with OFS-Feeds.  If not, see <http://www.gnu.org/licenses/>.
*/

/*  
    ObjectFS storage wrapper for RSS/Atom/etc. feeds.
 */

var filters = require("objectfs-core/mixins/filters");
var ioHandler = require("objectfs-core/ioHandler");
var objects = require("ringo/utils/objects");
var scheduler = require("ringo/scheduler");

exports.file_name = false;
exports.input_stream = false;
exports.feed_uri = false;
exports.push_blocker = false;


/**
 *
 */
exports.connect = function(feed_uri) {

    this.feed_uri = feed_uri;

    if (feed_uri.params.ofs_read_only && feed_uri.params.ofs_one_call) {
        this.input_stream = ioHandler.getInputStream(feed_uri);
    } else {
        this.file_name = ioHandler.getFileName(feed_uri);
    }

    this.iterate = filters.iterate(this.iterateAll.bind(this));
    this.list = filters.list(this.iterate);

    if (feed_uri.scheme == "rss" || feed_uri.path.match(/.rss$/)) {
        this.content_handler = require("ofs-feeds/rss-handler");
        this.read = filters.read("guid", this.iterate);
    } else {
        throw Error("Unrecognized URI type.");
    }
    
};


/**
 *
 */
exports.iterateAll = function() {

    var push_blocker = objects.clone(require("ctlr-sync/push-blocker"));
    this.content_handler.setCallback( push_blocker.push.bind(push_blocker) );
   
    //todo: add parser
    var parser = require("ctlr-xml/sax-path-parser");
    if (this.input_stream) {
        var action = parser.parseInputStream.bind(
            parser,
            this.input_stream,
            this.content_handler.pathHandlers);
    } else {
        var action = parser.parseFile.bind(
            parser,
            this.file_name,
            this.content_handler.pathHandlers);
    }

    scheduler.setTimeout(action, 0);

    for each (var item in push_blocker.iterate()) {
        yield item;
    }

};



