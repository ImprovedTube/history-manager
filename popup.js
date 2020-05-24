
/*-----------------------------------------------------------------------------
>>> «HEADER» TEMPLATE
-----------------------------------------------------------------------------*/

var header_search = false,
    search_type = 'bookmarks',
    Menu = {
        header: {
            type: 'header',

            section_start: {
                type: 'section',
                class: 'satus-section--align-start',
                style: {
                    position: 'relative'
                },

                text_field: {
                    type: 'text-field',
                    rows: 1,
                    class: 'satus-header__text-field',
                    placeholder: 'Search',
                    on: {
                        keyup: function(event) {
                            if (event.keyCode === 13) {
                                var type = search_type;

                                if (header_search !== false) {
                                    header_search.clear();
                                    header_search = false;
                                }

                                if (type === 'bookmarks') {
                                    Satus.chromium_bookmarks.get(function(items) {
                                        header_search = Satus.search(event.target.value, items, function(results) {
                                            var rows = [];

                                            for (var i = 0, l = results.length; i < l; i++) {
                                                rows.push([{
                                                    select: {
                                                        type: 'text'
                                                    }
                                                }, {
                                                    visit_count: {
                                                        type: 'text',
                                                        label: 0
                                                    }
                                                }, {
                                                    domain: {
                                                        type: 'text',
                                                        label: results[i]
                                                    }
                                                }]);
                                            }

                                            document.querySelector('#table-search').update(rows);
                                        });
                                    });
                                } else if (type === 'history') {
                                    Satus.chromium_history.get('', function(items) {
                                        header_search = Satus.search(event.target.value, items, function(results) {
                                            var rows = [];

                                            for (var i = 0, l = results.length; i < l; i++) {
                                                rows.push([{
                                                    select: {
                                                        type: 'checkbox'
                                                    }
                                                }, {
                                                    visit_count: {
                                                        type: 'text',
                                                        label: 0
                                                    }
                                                }, {
                                                    domain: {
                                                        type: 'text',
                                                        label: results[i]
                                                    }
                                                }]);
                                            }

                                            document.querySelector('#table-search').update(rows);
                                        });
                                    });
                                } else if (type === 'duckduckgo') {
                                    window.open('https://duckduckgo.com/?q=' + this.value, '_self');
                                } else if (type === 'google') {
                                    window.open('https://www.google.com/search?q=' + this.value, '_self');
                                }
                            }
                        }
                    }
                },

                menu: {
                    type: 'button',
                    icon: '<svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"></svg>',
                    onClickRender: {
                        type: 'dialog',

                        bookmarks: {
                            type: 'button',
                            label: 'Bookmarks',

                            on: {
                                click: function() {
                                    search_type = 'bookmarks';
                                    document.querySelector('.satus-dialog__scrim').click();
                                }
                            }
                        },
                        history: {
                            type: 'button',
                            label: 'History',

                            on: {
                                click: function() {
                                    search_type = 'history';
                                    document.querySelector('.satus-dialog__scrim').click();
                                }
                            }
                        },
                        duckduckgo: {
                            type: 'button',
                            label: 'DuckDuckGo',

                            on: {
                                click: function() {
                                    search_type = 'duckduckgo';
                                    document.querySelector('.satus-dialog__scrim').click();
                                }
                            }
                        },
                        google: {
                            type: 'button',
                            label: 'Google',

                            on: {
                                click: function() {
                                    search_type = 'google';
                                    document.querySelector('.satus-dialog__scrim').click();
                                }
                            }
                        }
                    }
                }
            },
            section_end: {
                type: 'section',
                class: 'satus-section--align-end',

                button_vert: {
                    type: 'button',
                    icon: '<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="5.25" r="0.45"/><circle cx="12" cy="12" r="0.45"/><circle cx="12" cy="18.75" r="0.45"/></svg>',
                    onClickRender: {
                        type: 'dialog',
                        class: 'satus-dialog--vertical-menu',

                        export: {
                            type: 'button',
                            label: 'Export',
                            onclick: function() {
                                chrome.runtime.sendMessage({
                                    name: 'download',
                                    filename: 'regex-replace.json',
                                    value: Satus.storage.get('data')
                                });
                            }
                        },
                        import: {
                            type: 'button',
                            label: 'Import',
                            onclick: function() {
                                try {
                                    var input = document.createElement('input');

                                    input.type = 'file';

                                    input.addEventListener('change', function() {
                                        var file_reader = new FileReader();

                                        file_reader.onload = function() {
                                            var data = JSON.parse(this.result);

                                            for (var i in data) {
                                                Satus.storage.set(i, data[i]);
                                            }

                                            Satus.render({
                                                type: 'dialog',

                                                message: {
                                                    type: 'text',
                                                    label: 'successfullyImportedSettings',
                                                    style: {
                                                        'width': '100%',
                                                        'opacity': '.8'
                                                    }
                                                },
                                                section: {
                                                    type: 'section',
                                                    class: 'controls',
                                                    style: {
                                                        'justify-content': 'flex-end',
                                                        'display': 'flex'
                                                    },

                                                    cancel: {
                                                        type: 'button',
                                                        label: 'cancel',
                                                        onclick: function() {
                                                            var scrim = document.querySelectorAll('.satus-dialog__scrim');

                                                            scrim[scrim.length - 1].click();
                                                        }
                                                    },
                                                    ok: {
                                                        type: 'button',
                                                        label: 'OK',
                                                        onclick: function() {
                                                            var scrim = document.querySelectorAll('.satus-dialog__scrim');

                                                            scrim[scrim.length - 1].click();
                                                        }
                                                    }
                                                }
                                            });
                                        };

                                        file_reader.readAsText(this.files[0]);
                                    });

                                    input.click();
                                } catch (err) {
                                    chrome.runtime.sendMessage({
                                        name: 'dialog-error',
                                        value: err
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    };
var History = {};

Menu.main = {
    type: 'main',
    scrollbar: false,
    onclick: function(event) {
        for (var i = 0, l = event.path.length; i < l; i++) {
            var item = event.path[i];

            if (item.nodeName === 'TD') {
                if (Array.prototype.indexOf.call(item.parentElement.children, item) === 3) {
                    var data = [],
                        object = History[item.innerText];

                    for (var key in object.items) {
                        data.push([
                            object.items[key].visitCount,
                            object.items[key].title,
                            key,
                            ''
                        ]);
                    }

                    document.querySelector('.satus-main__container > .satus-table:nth-child(2)').pagingIndex = 0;
                    document.querySelector('.satus-main__container > .satus-table:nth-child(2)').update(data, 0, 'desc');

                    i = l;
                }
            }
        }
    },

    table_01: {
        type: 'table',
        paging: 100,
        columns: [{
            title: ''
        }, {
            title: 'Visit count',
            sorting: 'desc'
        }, {
            title: ''
        }, {
            title: 'Domain'
        }]
    },

    table_02: {
        type: 'table',
        paging: 100,
        columns: [{
            title: 'Visit count'
        }, {
            title: 'Title'
        }, {
            title: 'URL'
        }, {
            title: 'Tags'
        }]
    },

    table_03: {
        type: 'table',
        paging: 100,
        columns: [{
            title: 'Visit count'
        }, {
            title: 'Domain'
        }]
    }
};
Satus.storage.import(function() {
    var end_time = new Date().getTime(),
        start_time = Satus.storage.get('startTime') || start_time - 7.776e+9;

    chrome.history.search({
        text: '',
        startTime: start_time,
        endTime: end_time,
        maxResults: 999999
    }, function(items) {
        History = Satus.storage.get('history') || {};

        for (var i = 0, l = items.length; i < l; i++) {
            var item = items[i],
                url = item.url,
                host = url.split('/')[2];

            if (History.hasOwnProperty(host) === false) {
                History[host] = {
                    items: {},
                    lastVisitTime: item.lastVisitTime,
                    visitCount: 0
                };
            }

            History[host].visitCount += item.visitCount;

            History[host].items[url] = {
                title: item.title,
                visitCount: item.visitCount
            };
        }

        Satus.storage.set('history', History);
        Satus.storage.set('startTime', end_time);

        var data = [];

        for (var key in History) {
            data.push(['', History[key].visitCount, '', key]);
        }

        Menu.main.table_01.data = data;

        Satus.render(Menu);

        document.querySelector('.satus-main__container td:nth-child(4)').click();
    });
});