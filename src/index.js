'use strict';

var app = require( 'app' );
var BrowserWindow = require( 'browser-window' );
var FS = require( 'fs' );

require( 'crash-reporter' ).start();

var mainWindow = null;

app.on( 'window-all-closed', function()
{
    if ( process.platform !== 'darwin' ){ app.quit(); }
} );

app.on( 'ready', function()
{
	var FS = require('fs');

	FS.readFile( './conf.json', 'utf8', function ( err, text )
	{
		const conf = JSON.parse( text );
		const opt = { width: 340, height: 600, resizable: false, frame: false };

		if ( conf.window )
		{
			delete opt.resizable;
			delete opt.frame;
		}
		if ( conf.width ){ opt.width = parseInt( conf.width ); }
		if ( conf.height ){ opt.height = parseInt( conf.height ); }

	    mainWindow = new BrowserWindow( opt );
    	mainWindow.loadUrl('file://' + __dirname + '/index.html');

	    mainWindow.on('closed', function()
    	{
        	mainWindow = null;
    	} );
	} );
} );
