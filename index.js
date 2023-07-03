const { checkLogLevel, generateConfig, generatePrefix, selectOutputStream, FakeStream } = require( './lib/utils.js' );
const inspector = require('node:inspector');

function isInDebugMode() {
    return inspector.url() !== undefined;
}

let consoleStamp = ( con, options = {} ) => {

    if ( con.__patched ) {
        con.reset();
    }

    const helperConsoleStream = new FakeStream();
    const helperConsole = new console.Console({ stdout: helperConsoleStream, stderr: helperConsoleStream, colorMode: true });

    const config = generateConfig( options );
    const include = config.include.filter( m => typeof con[m] === 'function' );

    const org = {};
    Object.keys( con ).forEach( m => org[m] = con[m] );
    con.org = org;

    include.forEach( method => {
        const stream = selectOutputStream( method, config );
        const trg = con[method];
        
        if ( checkLogLevel( config, method ) ) {
            con[method] = new Proxy( trg, {
                apply: ( target, context, args ) => {
                
                    helperConsole.log.apply( context, args );
                    
                    if( !( config.preventDefaultMessage || /:msg\b/.test( config.format ) )) {
                        stream.write(`${generatePrefix( method, config )} `);
                        stream.write( helperConsoleStream.last_msg );
                        
                    } else {
                        stream.write(`${generatePrefix( method, config, helperConsoleStream.last_msg )}`);
                        
                    }
                    if( isInDebugMode() && inspector.console?.[method] ) {
                        inspector.console[method].apply( context, args );
                        
                    }
                }
            });
        }

        con.__patched = true
    } );

    if(!include.includes('table')) {
        // Normaly table calls log to write to stream, we need to prevent prefix when table is not included
        const tableConsole = new console.Console( config.stdout, config.stderr );
        con.table = tableConsole.table;
    }

    con.reset = () => {
        Object.keys( con.org ).forEach( m => {
            con[m] = con.org[m];
            delete con.org[m];
        } );
        delete con.org;
        delete con.__patched;
        delete con.reset;
        helperConsoleStream.end();
    };

};

module.exports = consoleStamp;
module.exports.default = consoleStamp;

