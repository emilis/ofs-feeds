# OFS-Feeds 

ObjectFS storage wrapper for RSS/Atom/etc. feeds.

**Only RSS reading works for now.**

## Usage

### Example

```javascript
// Go over all items in a RSS feed:
var feeds = require("ofs-feeds");

feeds.connect({scheme:"rss",path:"/path/to/local/file.xml"});

for each (var item in feeds.iterate()) {
    print("RSS feed item", item.title, item.link);
}
```

### API summary

#### ofs-feeds

<table><tbody>
<tr><td align="right">Object</td>
    <td><b>read</b> (URI, ID)</td>
    <td>Read one record from the specified storage.</td></tr>
<tr><td align="right"><a href="https://developer.mozilla.org/en/JavaScript/Guide/Iterators_and_Generators">Iterator</a></td>
    <td nowrap="nowrap"><b>iterate</b> (URI, filter, options)</td>
    <td>A generator function that returns an iterator over all records in the storage matching the criteria.</td></tr>
</tbody></table>


#### ofs-feeds/rss-handler

<table><tbody>
<tr><td align="right">void</td>
    <td><b>setCallback</b> (callback)</td>
    <td>Specify a function that gets executed when an object for a RSS item is fully constructed.</td></tr>
</tbody></table>

### Requirements

- [RingoJS](http://ringojs.org/) v0.8
- [CTLR-XML](https://github.com/emilis/ctlr-xml) module
- [CTLR-Sync](https://github.com/emilis/ctlr-sync) module

## About

### License

This is free software, and you are welcome to redistribute it under certain conditions; see LICENSE.txt for details.

### Author contact

Emilis Dambauskas <emilis.d@gmail.com>, <http://emilis.github.com/>



