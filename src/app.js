'use strict';
var Remote = require('remote');
var Twitter = require('twitter');
var FS = require('fs');
var Shell = require('shell');

class View
{

	constructor()
	{
		this.list = [];
		this.max = 10;
		this.tl = document.getElementById( 'timeline' );
	}

	setTwitter( twitter )
	{
		this.twitter = twitter;
	}

	add( data )
	{
		if ( data.user === undefined ){ return; }
		this.addElement( data );
		while ( this.max < this.list.length ){ this.deleteElement( this.list.pop().id ); }
	}

	addElement( item )
	{
		this.list.unshift( item );
		this.tl.insertBefore( this.createElement( item ), this.tl.children[ 0 ] );
	}

	createElement( item )
	{
		const e = document.createElement( 'li' );
		e.id = 'tw' + item.id_str;

		if ( item.retweeted_status !== undefined )
		{
			// Retweet
			e.classList.add( 'rt' );
			item = item.retweeted_status;
		}

		const icon = document.createElement( 'img' );
		icon.src = item.user.profile_image_url;

		const name = document.createElement( 'h3' );
		name.textContent = item.user.name;

		const sname = document.createElement( 'h4' );
		sname.textContent = '@' + item.user.screen_name;

		const text = document.createElement( 'p' );
		text.innerHTML = item.text.replace( /(http:\/\/[\x21-\x7e]+)/gi, '<a href="#" onClick="Shell.openExternal(\'$1\');return false;">$1</a>' );

		e.appendChild( icon );
		e.appendChild( name );
		e.appendChild( sname );
		e.appendChild( text );

		if ( item.extended_entities !== undefined )
		{
			const ml = document.createElement( 'ol' );
			const list = item.extended_entities.media;
			for ( let i = 0 ; i < list.length ; ++i )
			{
				const mli = document.createElement( 'li' );
				const obj = list[ i ];
				switch ( obj.type )
				{
				case 'photo':
					const pic = new Image();
					pic.onload = function()
					{
						const w = pic.width;
						const h = pic.height;
						const scale = ( w < h ) ? obj.sizes[ 'thumb' ].h / h : obj.sizes[ 'thumb' ].w / w;
						pic.style.width = parseInt( w * scale ) + 'px';
						pic.style.height = parseInt( h * scale ) + 'px';
					};
					pic.src = obj.media_url;
					mli.appendChild( pic );
					break;
				}
				ml.appendChild( mli );
			}
			e.appendChild( ml );
		}

		const footer = document.createElement( 'div' );
		footer.appendChild( this.createButtonFav( item.id_str ) );
		footer.appendChild( this.createButtonRT( item.id_str ) );
		footer.appendChild( this.createButtonRep( item.id_str ) );
		e.appendChild( footer );

		let cname = '';
		if ( item.favorited ){ cname += 'fav'; }
		if ( item.retweeted ){ cname += 'rt'; }
		const fr = document.createElement( 'span' );
		if ( cname ){ fr.classList.add( cname ); }
		e.appendChild( fr );

		return e;
	}

	createButtonFav( id )
	{
		const self = this;
		const a = document.createElement( 'a' );
		a.href = '#';
		a.textContent = 'Fav';
		a.addEventListener( 'click', function()
		{
			self.twitter.post( 'favorites/create', { id: id, include_entities: false },
				function( error, tweets, response ) {
				}
			);
			return false;
		} );
		return a;
	}

	createButtonRT( id )
	{
		const a = document.createElement( 'a' );
		a.href = '#';
		a.textContent = 'RT';
		return a;
	}

	createButtonRep( id )
	{
		const a = document.createElement( 'a' );
		a.href = '#';
		a.textContent = 'Rep';
		return a;
	}

	deleteElement( id )
	{
		const del = document.getElementById( 'tw' + id );
		if ( del === undefined || del === null ){ return; }
		this.tl.removeChild( del );
	}
}

window.onload = function ()
{
	//var mainWindow = remote.getCurrentWindow();
	const view = new View();
	const opt = {
		consumer_key: process.env.consumer_key,
		consumer_secret: process.env.consumer_secret,
		access_token_key: process.env.access_token_key,
		access_token_secret: process.env.access_token_secret,
	};

	FS.readFile( './conf.json', 'utf8', function (err, text) {
		const conf = JSON.parse( text );
		if( conf.consumer_key ){ opt.consumer_key = conf.consumer_key; }
		if( conf.consumer_secret ){ opt.consumer_secret = conf.consumer_secret; }
		if( conf.access_token_key ){ opt.access_token_key = conf.access_token_key; }
		if( conf.access_token_secret ){ opt.access_token_secret = conf.access_token_secret; }

		console.log(JSON.stringify(opt));

		var tw = new Twitter( opt );
		view.setTwitter( tw );
		tw.stream('user', function(stream) {
			stream.on( 'data', function (data)
			{
//console.log(JSON.stringify(data));
				view.add( data );
			});
		});
	});
};
