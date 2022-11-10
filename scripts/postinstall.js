'use strict';

const path = require('path');
const fs = require('fs-extra');

async function patchReactNative( version )
{
	console.log( `Patching react-native ${version}`);

	const patchesDirectory = path.join(__dirname, '../patches');
	console.log(`Lookup patch in '${patchesDirectory}'`);

	const patchDirectoryPath = path.join( patchesDirectory, version );
	const patchExists = await fs.pathExists( patchDirectoryPath );
	if (!patchExists)
	{
		throw new Error( `Patch for react-native ${version} not found` );
	}

	console.log(`Found patch at '${patchDirectoryPath}'`);

	const reactNativeDirectoryPath = path.join( process.cwd(), 'node_modules', 'react-native' );

	const filterFunction = async ( src, dst ) =>
	{
		const stats = await fs.lstat(src);
		const isFile = stats.isFile();
		if (isFile)
		{
			console.log(`Patching\n\t${src}\n\t-> ${dst}\n\n`);
		}

		return true;
	};

	await fs.copy( patchDirectoryPath, reactNativeDirectoryPath, {
		overwrite: true,
		recursive: true,
		filter: filterFunction
	} );

	console.log(`react-native ${version} patched successfully`);
	console.log('');
};

async function readParentProjectConfiguration()
{
	const configurationFilePath = path.join( process.cwd(), 'package.json' );

	console.log(`Reading parent package configuration from '${configurationFilePath}'`);

	const configurationFileContent = await fs.readFile(configurationFilePath, 'utf8');
	const configuration = JSON.parse(configurationFileContent);

	return configuration;
}

async function main()
{
	const configuration = await readParentProjectConfiguration();
	const reactVersionString = configuration.dependencies[ 'react-native' ];
	if (!reactVersionString)
	{
		throw new Error('react-native not found in project dependencies');
	}

	console.log(`react-native version string: ${reactVersionString}`);

	// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
	const semverRegEx = /^[\^~]?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
	const matches = reactVersionString.match( semverRegEx );
	if (!matches)
	{
		throw new Error('react-native version string does not match semantic versioning');
	}

	const reactVersion = `${matches[1]}.${matches[2]}.${matches[3]}`;

	console.log(`react-native parsed version: ${reactVersion}`);

	await patchReactNative( reactVersion );
}

main();
