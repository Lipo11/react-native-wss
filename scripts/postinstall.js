'use strict';

const patchReactNative = async ( version ) =>
{
	console.log( 'Patching REACT NATIVE ' + version);

	const fs = require('fs');
	const yauzl = require('yauzl');

	const findPatch = function( version )
	{
		return new Promise( resolve =>
		{
			let patch = null;
			fs.readdirSync( './patches' ).forEach( file =>
			{
				if( file === version + '.zip' ){ patch = file; }
			});
			resolve( patch );
		});
	};

	const unzipFile = function( zip, destination )
	{
		return new Promise( ( resolve, reject ) =>
		{
			yauzl.open( zip, { lazyEntries: true }, ( err, zipfile ) =>
			{
				if ( err ) reject( err );

				zipfile.readEntry();

				zipfile.on( 'entry', ( entry ) =>
				{
					let outfile = destination + entry.fileName ;

					// directory entry
					if( /\/$/.test( entry.fileName ) )
					{
						if( ! fs.existsSync( outfile ) )
						{
							fs.mkdirSync( outfile );
						}

						zipfile.readEntry();
					}
					// file entry
					else
					{
						zipfile.openReadStream( entry, ( err, readStream ) =>
						{
							if ( err ) reject( err );

							readStream.on( 'end', () => { zipfile.readEntry(); } );

							readStream.pipe( fs.createWriteStream( outfile ) );
						});
					}
				});

				zipfile.on( 'end', () => resolve() );
			});
		});
	};

	const applyPatch = function( patchFile )
	{
		return new Promise( async ( resolve ) =>
		{
			await unzipFile( './node_modules/react-native-wss/patches/node_modules.zip', './node_modules/' );
			await unzipFile( './node_modules/react-native-wss/patches/' + patchFile, './node_modules/react-native/' );

			resolve();
		});
	};

	let patch = await findPatch( version );
	if( patch )
	{
		console.log( ' > found patch ' + patch );
		await applyPatch( patch );
		console.log( ' > patching finished' );
	}
	else
	{
		console.log( ' > patch not found!' );
	}

	console.log('');
};

( async () => {
	const configuration = require( '../../../package.json' );

	await patchReactNative( configuration.dependencies[ 'react-native' ] );
})();
