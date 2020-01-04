import * as explorer from './explorer'
/* eslint-disable */
const go = new Go();

export async function useWASM()
{
    let result = await WebAssembly.instantiateStreaming(fetch("/main.wasm"), go.importObject)
    go.run(result.instance);
    console.log(testWASM())
    /*let minerTx = 
    console.log("Miner tx from wasm is " + minerTx)
    console.log("Txs in block: " + block.json.tx_hashes)
    explorer.loadTxs(block.json.tx_hashes).then(result => {
        console.log(result)
        let test = wasm.deserializeTx(JSON.stringify(result))

        if (test)
            console.log(JSON.parse(test))
    })*/
}

export function addMinerTxToBlock(block)
{
    let minerTx = getMinerTxFromBlob(block.blob)
    
    block.json.tx_hashes.unshift(minerTx)
}

export async function loadTxs(blockJson)
{
    let result = await explorer.loadTxs(blockJson.tx_hashes)
    blockJson.txs = JSON.parse(deserializeTx(JSON.stringify(result)))
    blockJson.Mtx = blockJson.txs[0]
    blockJson.txs.shift(0)
}