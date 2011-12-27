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
    Content handlers for RSS feeds.
*/

/**
 *
 */
exports.pathHandlers = false;

/**
 *
 */
exports.setCallback = function(cb) {

    this.pathHandlers = createPathHandlers(cb);
};


/**
 *
 */
function createPathHandlers(callback) {

    var handlers = {
        endDocument: function() {
            callback(StopIteration);
        },
        "/rss/channel/item": {
            startElement: function(namespaceURI, localName, qName, atts) {
                handlers.item = {};
            },
            endElement: function(namespaceURI, localName, qName) {
                callback(handlers.item);
            }
        }
    };

    var item_elements = [
        "title",
        "link",
        "description",
        "author",
        "category",
        "comments",
        //"enclosure", // {url, length, type}
        "guid",
        "pubDate",
        //"source", // {name, url}
    ];

    for each (var name in item_elements) {
        handlers["/rss/channel/item/" + name] = addProperty(name);
    }

    return handlers;

    //
    function addProperty(name) { 
        return function(str) {
            handlers.item[name] = str;
        };
    };

};
