# PAC Summer 2014 Project

## Environment

For OSX
Install node.js (v0.10.x) and NPM (v1.4.x)

    brew install node
    
Verify your node.js installation

    node --version
    
    > output
    > v0.10.26
    
    npm --version
    
    > output
    > 1.4.4

Install MongoDB (2.6.x)

    brew install mongodb
    
Local httpd server needed for the ARES client (configuration below for Apache httpd)

## Setup and run the application

### Server
Checkout [ARES server](https://github.com/marcojahn/ares-server) to your computer.

Install dependencies and optional tools

    // switch into your "ares-server" checkout repository and run
    npm install
    
    // to use the grunt build env (not needed for just running the server)
    npm install -g grunt-cli
    
Start your local mongodb

    // start your local mongodb instance (e.g.)
    mongod --config /usr/local/etc/mongod.conf

Start the server

    // run the server
    npm start
    
    // you shoud see "up and running" appearing to your console

Initial data setup

    // to be able to log into the application you need to setup and administrative user
    
    // connect to your local mongodb
    mongo
    use ares
    
    // insert an admin user to collection "users"
    db.users.insert({
        "username" : "admin",
        "password" : "$2a$10$MRak3m7Zqk7QFHkv1QqTEuLMnU1kH.sVwZSpxbSmi3rVJU1PcD0Ni",
        "email" : "admin@example.com",
        "licenses" : [],
        "usergroup" : "admin"
    });
    
    // you can verify the user and your local setup using the REST interface
    POST http://localhost:8080/anonymous/sessions
    {
        "username": "admin",
       	"password": "admin"
    }
    
    // the response should send the created db object from users collection.

Changing the base configuration

Node.js port and mongodb configuration can be changed in ./config/config.js

### Client
Checkout [ARES client](https://github.com/marcojahn/ares-client) to your httpd home directory

Your httpd server (or local virtualhost) must be configured to be used as reverse proxy for the web client.
Here is an example configuration for Apache2 httpd

    <VirtualHost *:80>
        DocumentRoot "/Users/mjahn/Sites/pacdev.dev"
        ServerName pacdev.dev
        #ServerAlias your.alias.here
        
        ScriptAlias /cgi-bin "/Users/mjahn/Sites/pacdev.dev/cgi-bin"
        
        <Directory "/Users/mjahn/Sites/pacdev.dev">
            Options All
            AllowOverride All
            Order allow,deny
            Allow from all
        </Directory>
        
        RewriteEngine On
        RewriteRule ^/WebService/(.*) http://127.0.0.1:8080/$1 [NC,P]
        
        CustomLog "/Users/mjahn/Sites/pacdev.dev/logs/access_log" combined
        ErrorLog "/Users/mjahn/Sites/pacdev.dev/logs/error_log"
    </VirtualHost>

Your ARES client installation should now be accessible using your browser (e.g. pacdev.dev).
To login into your application use the user created above.

Username: admin
Password: admin

Changing the base configuration

If you need to modify the base REST URL configuration or something else, all configuration can be found in <pacdev.dev client>/app/CONFIG.js.
