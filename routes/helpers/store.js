"use strict";

var store = {
	"exampleUser1":{ //exampleUser1 = psid de facebook
		language: "ES", //currently supported ES, EN.
		city: "Bilbao"
	}
};
var update =function(id,userData){
	store[id] = userData;
}
var getData = function(id){
	return store[id];
}
module.exports = {
	setData: update,
	getData: getData
}
//teniendo en cuenta que guardamos muy pocos datos y muy simples, no hace falta una store 'compleja'. (e.g redux)
//futuro igual es interesante llevar a sql. (por ahora en memoria nos sirve)