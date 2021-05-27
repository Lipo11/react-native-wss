# React native WebSocket Secure ( 0.64.1 )
Every project what i created has problem with securing websockets.\
So, I decide to share my codes with everyone, and i hope this will be merged into react native one day.\
This library allows you to set wss address in WebSocket with ca (plain cert), pfx (base64) and passphrase.\
Small coffe makes me happy :)\
<a href="https://www.buymeacoffee.com/Lipo11" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a>

### Installing
Install the react-native-wss repository & yauzl library to devDependencies
```sh
npm i --save-dev react-native-wss yauzl
```
Add postinstall into project package.json scripts object
```js
"scripts": {
  "postinstall": "node node_modules/react-native-wss/scripts/postinstall.js"
}
```

### Run the postinstall
```sh
npm i
# or
npm run postinstall
```

### API
Now, you can use wss address with certificates. ( No need to import any other libs. )
```js
this._ws = new WebSocket( 'wss://192.168.0.1', [],
{
  headers: { Authorization: 'Bearer 123' },
  ca: '-----BEGIN CERTIFICATE-----\n\n-----END CERTIFICATE-----\n',
  pfx: 'base64==',
  passphrase: 'mustbedefinedforpfx'
});
```

### Postinstall error patch not found!
I compile only latest version of react native. ( Because of repo size )\
When you need older version of react native you need to compile android .aar manualy.\
[HOW TO COMPILE ANDROID AAR.](ANDROID.md)\
Do you need help? You should create issue and I can help you :)