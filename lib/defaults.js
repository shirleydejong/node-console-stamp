const date = require( '../tokens/date' );
const label = require( '../tokens/label' );
const msg = require( '../tokens/msg' );
const isoDate = require( '../tokens/isoDate' );

module.exports = {
    format: '',
    dfFormat: ':date($$) :label(7)',
    dfDateFormat: 'dd.LL.yyyy HH:mm.ss.S',
    include: ['debug', 'log', 'info', 'warn', 'error'],
    tokens: {
        date,
        label,
        msg,
        isoDate,
    },
    level: 'log',
    levels: {
        error: 1,
        warn: 2,
        info: 3,
        log: 4,
        debug: 5,
    },
    extend: {},
    groupCount: 0,
    preventDefaultMessage: false,
    colorMode: true,
};
