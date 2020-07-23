var _lz_ua = navigator.userAgent.toLowerCase();
var _lz_opera = /opera [5678]|opera\/[5678]/i.test( _lz_ua );
var _lz_ie = !_lz_opera && /msie [56789]/i.test( _lz_ua );

var lzIEPushText = '';

function lzPush(s) {
	s = s.replace( /Q0/g, '<' ).replace( /Q1/g, '>' ).replace( /Q2/g, '\"' );
	var win = window.open();
	win.document.open();
	win.document.write( ''+
		'<html>'+
			'<head>'+
				'<title>Napake in opozorila</title>'+
				'<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>'+
			'</head>'+
			'<body>'+s+'</body>'+
		'</html>' );	
	win.document.close();
	win.print();
}

function lzIEPushDone() {
	lzPush( lzIEPushText );
	lzIEPushText = '';
}
function lzIEPushContinue() {
}
function lzIEPush(s,no) {
	lzIEPushText += s;
	document.getElementById( 'lzapp' ).SetVariable( 'lzIEPushExternal', '1' );
}
