import * as explorer from './explorer'
/* eslint-disable */
const go = new Go();

export async function useWASM()
{
    if (!WebAssembly.instantiateStreaming) { // polyfill
        WebAssembly.instantiateStreaming = async (resp, importObject) => {
            const source = await (await resp).arrayBuffer();
            return await WebAssembly.instantiate(source, importObject);
        };
    }

    let result = await WebAssembly.instantiateStreaming(fetch("/main.wasm"), go.importObject)
    go.run(result.instance);
    console.log(testWASM())
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

export async function parseTx(txHash)
{
    let result = await explorer.loadTxs([txHash])
    result = JSON.parse(deserializeTx(JSON.stringify(result)))
    let block = await explorer.loadBlock(result[0].ValidBlock)

    result[0].Depth = block.block_header.depth
    result[0].Timestamp = block.block_header.timestamp

    return result
}

export async function loadFullBlock(blockID)
{
    let result = {}
    let block = await explorer.loadBlock(blockID)
    if (block.json)
    {
        block.json = JSON.parse(block.json)

        if (!block.json.tx_hashes)
        {
            block.json.tx_hashes = []
        }

        addMinerTxToBlock(block)

        let txs = await explorer.loadTxs(block.json.tx_hashes)
        result = await JSON.parse(loadBlock(JSON.stringify(block), JSON.stringify(txs)))
        console.log(result)
    }

    return result
}