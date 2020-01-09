# DERO Explorer

A simple and easy-to-use **Blockchain Explorer** designed for the DERO Network using VueJS Framework and WASM.

Demo website: https://dero.best

## Screenshots

### Index Page
![](https://github.com/Slixe/dero-explorer/blob/master/screenshots/index.jpeg?raw=true)

### Block Page
![](https://github.com/Slixe/dero-explorer/blob/master/screenshots/block.jpeg?raw=true)

### Tx Page
![](https://github.com/Slixe/dero-explorer/blob/master/screenshots/tx1.jpeg?raw=true)

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Lints and fixes files
```
yarn run lint
```

### Compile Go file for WebAssembly
```
cd go
```
```
GOOS=js GOARCH=wasm go build -o main.wasm
```
```
mv main.wasm ../public/main.wasm
```

## Donations

### DERO: 
```
dERokevAZEZVJ2N7o39VH81BXBqX9ojtncnPTDMyiVbmYiTXQY93AUCLcor9xsWCKWhYy25ja89ikZWXWab9kXRB7LYfUmbQyS
```
