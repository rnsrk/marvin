# Marvin

<div style="text-align: center;">
<img src="marvin.ico"/>
<p>
Document manager for Institute for Art Technology and Conservation at <a href="https://gnm.de" _targer="blank">Germanic National Museum Nuremberg </a>
</p>
</div>

## Description
Search object information for a given objectid at https://objektkatalog.gnm.de/rest_export/ and populate MS Word templates.

## Prerequisites
You need [nodejs](https://nodejs.org/en/) for running and building. You may want to install it with nvm ([windows](https://docs.microsoft.com/de-de/windows/dev-environment/javascript/nodejs-on-windows)/ [linux](https://github.com/nvm-sh/nvm)).

## Install
~~~sh
git clone https://github.com/rnsrk/marvin.git
cd marvin
npm i
~~~

## Usage
Start devServer
~~~sh
npm run start
~~~
Build Windows / Linux executable
~~~sh
npm run package
~~~

## Thanks
I've used the [Boilerplate](https://github.com/alexdevero/electron-react-webpack-boilerplate.git) by [Alex Devero](https://github.com/alexdevero/)

