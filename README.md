## React Native THEOplayer Connector Template

### Overview

This template provides boilerplate code for a [react-native-theoplayer](https://github.com/THEOplayer/react-native-theoplayer)
connector.

Additionally, an example app is generated that demonstrates how to use the connector.
The example uses [react-native-tvos](https://github.com/react-native-tvos/react-native-tvos) 
to enable support for tvOS. It can be deployed on these platforms:

- Android, AndroidTV & FireTV
- iOS & tvOS
- Web-based platforms

### Usage

First create a new connector project base on this template, named for example `THEODemoConnector`:

```
$ npx react-native init THEODemoConnector --template react-native-theoplayer-connector-template
```

The dependencies will be installed as well.

### Running the Example App

There is an example project included in the template to facilitate testing the connector.

```
$ cd THEODemoConnector/example
$ npm i
$ npm run web
$ npm run android
$ (cd ios && pod install) && npm run ios
```

### Connector Bridge

The connector template includes a simple API with `initialize` and `destroy` methods that bridge to 
native iOS and Android.

```typescript
export class ReactNativeTHEOplayerConnectorAdapter {
    constructor (private player: THEOplayer, config: ReactNativeTHEOplayerConnectorConfiguration) {
        NativeModules.ReactNativeTHEOplayerConnectorModule.initialize(this.player.nativeHandle, config);
    }

    destroy(): void {
        NativeModules.ReactNativeTHEOplayerConnectorModule.destroy(this.player.nativeHandle || -1);
    }
}
```

The `nativeHandle` is used to uniquely identify the player instance, as each player can have its own
connector instance.
On the native iOS and Android side, the handle resolves to the corresponding player instance.

On Android:

```kotlin
@ReactMethod
fun initialize(tag: Int, connectorConfig: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
        view?.player?.let { player ->
            val config = ReactNativeTHEOplayerConnectorConfiguration(
                connectorConfig.getBoolean(PROP_DEBUG),
            )
            connectors[tag] =
                ReactNativeTHEOplayerConnector(reactApplicationContext, player, config)
        }
    }
}

@ReactMethod
fun destroy(tag: Int) {
    connectors[tag]?.destroy()
    connectors.remove(tag)
}
```

On iOS:

```swift
@objc(initialize:config:)
func initialize(_ node: NSNumber, config: NSDictionary) -> Void {
    log("initialize triggered.")

    DispatchQueue.main.async {
        log(config.debugDescription)
        if let view = self.view(for: node), let player = view.player, let sendError = view.mainEventHandler.onNativeError {
            let connector = ReactNativeTHEOplayerConnector()
            self.connectors[node] = connector
        } else {
            log("Cannot find THEOPlayer for node \(node)")
        }
    }
}

@objc(destroy:)
func destroy(_ node: NSNumber) -> Void {
    log("destroy triggered.")
    DispatchQueue.main.async {
        self.connectors.removeValue(forKey: node)
    }
}
```

The API can be extended with additional bridge methods.
