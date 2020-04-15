# React native WebSocket Secure
Every project what i created has problem with securing websockets.
So, I decide to share my codes with everyone, and i hope this will be merged into react native one day.
This library allows you to set wss address in WebSocket with ca (plain cert), pfx (base64) and passphrase.

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