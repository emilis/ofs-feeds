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


var objects = require("ringo/utils/objects");
var scheduler = require("ringo/scheduler");

exports.feed_uri = false;
exports.push_blocker = false;


/**
 *
 */
exports.connect = function(feed_uri) {

    this.feed_uri = feed_uri;

    if (feed_uri.schema == "rss" || feed_uri.path.match(/.rss$/)) {
        this.content_handler = require("ofs-feeds/rss-handler");
    }
    
};


/**
 *
 */
exports.read = function(item_url) {

    for each (var item in this.iterateAll()) {
        if (item.url == item_url) {
            return item;
        }
    }
};


/**
 *
 */
exports.iterate = function(filter, options) {

    for each (var item in this.iterateAll()) {
        yield item;
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
    scheduler.setTimeout(
        parser.parseFile.bind(
            parser,
            this.feed_uri.uri,
            this.content_handler.pathHandlers),
        0);

    for each (var item in push_blocker.iterate()) {
        yield item;
    }

};


/**
 *
 */
exports.list = function(filter, options) {

    var l = [];
    for each (var record in this.iterate(filter, options)) {
        l.push(record);
    }
    return l;
};

