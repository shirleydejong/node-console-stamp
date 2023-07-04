const DateTime = require( 'luxon' ).DateTime;
const pico = require( 'picocolors' );
module.exports = ( { params: [utc = false, date = new Date] } ) => {
	
	const base = utc ? DateTime.fromJSDate( date ).setZone('utc') : DateTime.fromJSDate( date ).setZone('system')
	
	const dateISO = `${ pico.white(base.toISODate()) }`;
	const time = `${ pico.white(base.toFormat('HH:mm:ss.SSS')) }`;
	const tz = `${ pico.dim(base.toFormat('ZZ')) }`;
	const sep = `${ pico.dim('T') }`;
	
	return `${dateISO}${sep}${time}${tz}`;

}