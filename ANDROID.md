# Compile android native code with wss support

There are two ways of how to build react-native for android so far. Choose one that fits you best.

1. [Compilation with preinstalled prerequisities](#compilation-with-preinstalled-prerequisities)
2. [Compilation using docker](#compilation-using-docker)

## Compilation with preinstalled prerequisities

Follow these instructions when building on machine with all android build tools preinstalled and environment setup for building react-native for android OS.

### This step can be skipped ( I compile the newest react native version with WSS into patches/ )
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

## Compilation using docker

This alternative of building react-native is usefull when building in CI or on computer without all build tools preinstalled.

> NOTE:
>
> Docker image with android build tools is pretty fat so take this into account when using it. Once extracted is costs you about 13 gigs of disk space.

### Clone react-native

Clone react-native repository and checkout tag with requested version

> NOTE:
>
> In time of writing this documentation version 0.64.4 were used

```sh
git clone https://github.com/facebook/react-native
cd react-native
git checkout v0.64.4
```

### Disable docuemntation generation

Disable task `androidJavadoc` in `ReactAndroid/release.gradle`

```diff
- task androidJavadoc(type: Javadoc, dependsOn: generateReleaseBuildConfig) {
-    source = android.sourceSets.main.java.srcDirs
-    classpath += files(android.bootClasspath)
-    classpath += files(project.getConfigurations().getByName("compile").asList())
-    classpath += files("$buildDir/generated/source/buildConfig/release")
-    include("**/*.java")
-}
+ // task androidJavadoc(type: Javadoc, dependsOn: generateReleaseBuildConfig) {
+ //    source = android.sourceSets.main.java.srcDirs
+ //    classpath += files(android.bootClasspath)
+ //    classpath += files(project.getConfigurations().getByName("compile").asList())
+ //    classpath += files("$buildDir/generated/source/buildConfig/release")
+ //    include("**/*.java")
+ // }
```

also disable task `androidJavadocJar` in `ReactAndroid/release.gradle`

```diff
- task androidJavadocJar(type: Jar, dependsOn: androidJavadoc) {
-     classifier = "javadoc"
-     from(androidJavadoc.destinationDir)
- }
+ // task androidJavadocJar(type: Jar, dependsOn: androidJavadoc) {
+ //     classifier = "javadoc"
+ //     from(androidJavadoc.destinationDir)
+ // }
```

Remove docs `androidJavadocJar` artifact

```diff
    artifacts {
-        archives(androidSourcesJar)
+        // archives(androidJavadocJar)
    }
```

### Fix Folly compile time error

Add following definition to `ReactAndroid/build.gradle`

```diff
+ def follyReplaceContent = '''
+   ssize_t r;
+   do {
+     r = open(name, flags, mode);
+   } while (r == -1 && errno == EINTR);
+   return r;
+ '''
```

Update `prepareFolly` task in `ReactAndroid/build.gradle`

```diff
task prepareFolly(dependsOn: dependenciesPath ? [] : [downloadFolly], type: Copy) {
    from(dependenciesPath ?: tarTree(downloadFolly.dest))
    from("src/main/jni/third-party/folly/Android.mk")
    include("folly-${FOLLY_VERSION}/folly/**/*", "Android.mk")
    eachFile { fname -> fname.path = (fname.path - "folly-${FOLLY_VERSION}/") }
+    // Fixes problem with Folly failing to build on certain systems. See
+    // https://github.com/facebook/react-native/issues/28298
+    filter { line -> line.replaceAll('return int\\(wrapNoInt\\(open, name, flags, mode\\)\\);', follyReplaceContent) }
    includeEmptyDirs = false
    into("$thirdPartyNdkDir/folly")
}
```

Build android artifacts using docker (https://github.com/facebook/react-native/issues/30271#issuecomment-851347219) running following command within `react-native` directory

```sh
docker run \
    --rm \
    --name rn-build \
    -v $PWD:/pwd \
    -w /pwd \
    reactnativecommunity/react-native-android:6.1 \
    /bin/sh -c "./gradlew installArchives --no-daemon"
```

Rename resulting AAR file in build directory

```sh
cd ReactAndroid/build/outputs/aar/
cp ReactAndroid-release.aar react-native-0.64.4.aar
```
