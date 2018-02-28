"use strict";

var store = {
	"exampleUser1":{ //exampleUser1 = psid de facebook
		"language": "ES", //currently supported ES, EN.
		"city": "Bilbao"
	}
};

module.exports = {
	store: store
}; 
//teniendo en cuenta que guardamos muy pocos datos y muy simples, no hace falta una store 'compleja'. (e.g redux)
//futuro igual es interesante llevar a sql. (por ahora en memoria nos sirve)