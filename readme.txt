To run the server first you need node.js:
	https://nodejs.org/

Make sure to use the recommended node.js version! Versions with a leading 0
e.g. 0.10.x and other older versions might not work! This application was developed 
using node.js  version 6.9 and 9.8.1! 

After installing run the following commands:
    
    npm install
            will install all required packages for it to work.

    node server.js
            will run the server.
            

The app should print the following lines (or similar):

	This app was developed and tested with nodejs v6.9 and v8.9.1. Your current nodejs version: v8.9.1
	websockets/http listening on 0.0.0.0:12776
	secure websockets/https listening on 0.0.0.0:12777


Configuration: 
You can change used ports and other details in the file config.json. By
default the app will use two ports 12776 for websockets (ws/http) and 12777 for
secure websockets(wss/https). Many cloud services / hosting provider only 
support one port for a single app which is being set via the PORT environment
variable (process.env.port in node.js). In this case you can only run
ws/http or wss/https in a single app and you should remove either httpConfig or
httpsConfig from the config.json.
Some providers have other restrictions and you might have to change the server.js.
Please check with your hosting provider if you have problems.

Using HTTPS / WSS for secure connections:
The files ssl.cert and ssl.key contain an example ssl certificate to allow 
testing secure connections via native applications. Browsers / WebGL apps 
will not accept this certificate and trigger a security error. You need to 
replace the files with your own certificate which needs to be created for your
domain name. You can find more about this in the FAQ at:
https://because-why-not.com/webrtc/faq/


You can now test if your server is running properly:

Depending on the data in your config.json try visiting following urls:
		http://yourip:yourport/
	and secure connection:
		https://yourip:yourport/
		(this will show a security warning if you use the default ssl.crt / ssl.key)
The two pages should print "running" if the server is active and accessible. If this fails
the most common problem are issues with firewalls / provider specific issues. Please check with
your hosting provider first before asking for support or reporting bugs.

If you still have any problems or questions:
Send a mail to contact@because-why-not.com or visit https://because-why-not.com !