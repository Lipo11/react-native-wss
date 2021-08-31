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
# node_modules/react-native-wss/patches/ReactAndroid/src/main/java/com/facebook/react/modules/websocket/WebSocketModule.java
cp patches/ReactAndroid/ nativeReact/ReactAndroid/

# Let's build android native project( be sure NDK is installed and path is defined into bash_brofile )
# When you can see the following error "ndk-build binary cannot be found" you can just open the project in the Android Studio and set the NDK path in File > Project Structure > SDK Location
# Run this into react native repository folder
npm i
./gradlew clean
./gradlew assembleRelease

# After the react native was built with success, rename the file
# ReactAndroid/build/outputs/aar/ReactAndroid-release.aar
# to your project react native version ( for example 0.61.5 )
# ReactAndroid/build/outputs/aar/react-native-0.61.5.aar
mv nativeReact/ReactAndroid/build/outputs/aar/ReactAndroid-release.aar nativeReact/ReactAndroid/build/outputs/aar/react-native-0.61.5.aar

# and copy it into your project root with path
# node_modules/react-native-wss/patches/android/com/facebook/react/react-native/0.61.5/react-native-0.61.5.aar
mkdir -p node_modules/react-native-wss/patches/android/com/facebook/react/react-native/0.61.5/
cp nativeReact/ReactAndroid/build/outputs/aar/react-native-0.61.5.aar node_modules/react-native-wss/patches/android/com/facebook/react/react-native/0.61.5/

# The last step is zip the folder patches/android/ with name of your react native project version ( for example 0.61.5 )
cd node_modules/react-native-wss/patches/
zip -r -X 0.61.5.zip android
```