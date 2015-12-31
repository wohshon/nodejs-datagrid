var formatVarName=function(str) {
	var s=str.replace(/-/g,"_").toUpperCase();
	return s;
};
//env variables
console.log(process.env.APPLICATION_NAME);
var APPLICATION_NAME=formatVarName(process.env.APPLICATION_NAME);
var defaultCache=process.env.DEFAULT_CACHE || 'default';
//var DG_SERVICE_HOST=process.env.DATAGRID_APP_DG_SERVICE_HOST;
//var DG_SERVICE_PORT=process.env.DATAGRID_APP_DG_SERVICE_PORT;
var DG_SERVICE_HOST=process.env[APPLICATION_NAME+'_DG_SERVICE_HOST'];
var DG_SERVICE_PORT=process.env[APPLICATION_NAME+'_DG_SERVICE_PORT'];
	  var jdgOptions={
			  host: DG_SERVICE_HOST,
			    //path: "/rest/teams/test",
			  path: "/rest/demoCache/test",
			    method: "PUT",
			    port: DG_SERVICE_PORT,
			    data: "1234",			    
			    headers: {
			    	'Content-type':'text/plain'
			    	}
			   };
exports.index = function(req, res) {
	res.sendfile("views/jdg.html");
};

exports.about = function(req, res) {
	res.sendfile("views/about.html");
};


exports.put = function(req, res) {
	//console.log('received put request for '+Object.keys(req.body));
	console.log('received put request for  '+req.body.cacheKey+' : '+req.body.cacheValue);
	var cacheName=req.body.cacheName || defaultCache;
	console.log('cacheName :'+cacheName);
	//jdgOptions.host="localhost";
	jdgOptions.path="/rest/"+cacheName+"/"+req.body.cacheKey;
	jdgOptions.method='PUT';
	jdgOptions.data=req.body.cacheValue;
	console.log(jdgOptions.path);
	console.log(jdgOptions.host);
	console.log(jdgOptions.data);
	callRest(jdgOptions,res);
//	res.send('put request');
//	res.end();
};

exports.get = function(req, res) {
//	console.log('received get request for '+Object.keys(req));
	console.log('received get request for  '+req.query.cacheKey);
	var cacheName=req.body.cacheName ||defaultCache;
	console.log('cacheName :'+cacheName);
	//jdgOptions.host="localhost";
	jdgOptions.path="/rest/"+cacheName+"/"+req.query.cacheKey;
	jdgOptions.method='GET';
	jdgOptions.data=null;
	callRest(jdgOptions,res);

//	res.send('get request');
//	res.end();
};

exports.list = function(req, res) {
//	console.log('received get request for '+Object.keys(req));
	console.log('received list request');
	var cacheName=req.body.cacheName || defaultCache;
	console.log('cacheName :'+cacheName);
	//jdgOptions.host="localhost";
	jdgOptions.path="/rest/"+cacheName;
	jdgOptions.method='GET';
	jdgOptions.data=null;
	callRest(jdgOptions,res);

//	res.send('list request');
//	res.end();
};


var http = require('http');

var callRest=function (options, res) {
	 var restReq = http.request(options, function(restResp) {
		  console.log('STATUS: ' + restResp.statusCode);
		  console.log('HEADERS: ' + JSON.stringify(restResp.headers));
		  restResp.setEncoding('utf8');
		  var output='';
		  restResp.on('data', function (chunk) {
		    console.log('BODY: ' + chunk);
		    output+=chunk;
		  });
		  restResp.on('end', function() {
		    console.log('No more data in response. '+this.statusCode);
		    if (this.statusCode=='200' ) {
		    	if (options.method=='PUT') {
		    		res.send('Saved Successful' );
		    	} else if ( options.method=='GET') {
		    		res.send(output);
		    	}
		    }
		  });
		});		 
	 
	 restReq.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
		  res.send('there is a problem with this request: ' + e.message);
		});

		// write data to request body for PUT usecases
 	if (options.method=='PUT') {	 
	 restReq.write(options.data);
 	}
	 restReq.end();		 	
}; 