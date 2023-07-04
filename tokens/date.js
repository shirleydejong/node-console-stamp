const DateTime = require( 'luxon' ).DateTime;
module.exports = ( { params: [format, utc = false, date = new Date] } ) => {
    if( utc ) {
        return DateTime.fromJSDate( date ).setZone('utc').toFormat( format ) 
    }
    return DateTime.fromJSDate( date ).setZone('system').toFormat( format ) 
}
