 function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

if(isMobileDevice())
{
	console.log("Es Celuco");
	console.log(screen.orientation.type);
}
else
{
	console.log("No es celuco");
}