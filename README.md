# React native WebSocket Secure
Every project what i created has problem with securing websockets. So I decide to share my codes with everyone, and i hope this will be merged into react native one day.

### Installing
Copy scripts/postinstall.js and patches/node_modules.zip into your project root
```sh
cp -r ./{scripts,patches} project/
```
Install yauzl library to devDependencies
```sh
npm i project/ --save-dev yauzl
```
Add postinstall into project package.json scripts object
```js
"scripts": {
	"postinstall": "node scripts/postinstall.js"
}
```

### Compile android native code with wss support
#### This step can be skipped ( I compile the newest react native version with WSS into patches/ )
```sh
#Clone repository from github.
git clone https://github.com/facebook/react-native.git
#Checkout to your version of react native into cloned react native repository folder.
git checkout 0.61-stable
```

```sh
# Now, You have to replace a file
# ReactAndroid/src/main/java/com/facebook/react/modules/websocket/WebSocketModule.java
# with (into react native repository folder)
# scripts/ReactAndroid/src/main/java/com/facebook/react/modules/websocket/WebSocketModule.java
cp scripts/ReactAndroid/ nativeReact/ReactAndroid/

# Let's build android native project( be sure NDK is installed and path is defined into bash_brofile )
# When you can see the following error "ndk-build binary cannot be found" you can just open the project in the Android Studio and set the NDK path in File > Project Structure > SDK Location
# Run this into react native repository folder
npm i
./gradlew clean
./gradlew assembleRelease

# After the react native was builded with success, rename the file
# ReactAndroid/build/outputs/aar/ReactAndroid-release.aar
# to your project react native version ( for example 0.61.5 )
# ReactAndroid/build/outputs/aar/react-native-0.61.5.aar
mv ReactAndroid/build/outputs/aar/ReactAndroid-release.aar ReactAndroid/build/outputs/aar/react-native-0.61.5.aar

# and copy it into your project root with path
# patches/android/com/facebook/react/react-native/0.61.5/react-native-0.61.5.aar
mkdir -p project/patches/android/com/facebook/react/react-native/0.61.5/
cp nativeReact/ReactAndroid/build/outputs/aar/react-native-0.61.5.aar project/patches/android/com/facebook/react/react-native/0.61.5/

# The last step is zip the folder patches/android/ with name of your react native project version ( for example 0.61.5 )
zip -r -X 0.61.5.zip project/patches/android
```

### Run the postinstall
```sh
npm i
# or
node scripts/postinstall.js
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