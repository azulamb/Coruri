
## install

```
npm -g install electron-prebuilt
npm -g install electron-packager
npm i
```

## Token

Create conf.json or Environment variable.

### conf.json

```
{"consumer_key":"CONSUMER_KEY","consumer_secret":"CONSUMER_SECRET","access_token_key":"ACCESS_TOKEN","access_token_secret":"ACCESS_TOKEN_SECRET"}
```

### Environment variable

#### Linux
```
export consumer_key="CONSUMER_KEY"
export consumer_secret="CONSUMER_SECRET"
export access_token_key="ACCESS_TOKEN"
export access_token_secret="ACCESS_TOKEN_SECRET"
```

#### Windows
```
set consumer_key=CONSUMER_KEY
set consumer_secret=CONSUMER_SECRET
set access_token_key=ACCESS_TOKEN
set access_token_secret=ACCESS_TOKEN_SECRET"
```

## Config

Create conf.json and write value.

* window
   * true = Normal window mode.
* width
   * Window width
* height
   * Window height.

### Sample

```
{"window":true,"width":340,"height":600}
```
