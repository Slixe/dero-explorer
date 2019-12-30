/* eslint-disable no-console */
var daemon = 'https://wallet.dero.io/json_rpc'

export function getInfo()
{
    return postData("get_info")
}

export async function loadBlocks(pos, size)
{
    const blocks = []

    for (let i = 0; i < size; i++)
    {
        let block = await loadBlock(pos - i)
        if (block) {
            blocks.push(block)
        }
    }

    return blocks
}

export function loadBlock(blockHash)
{ // if block Hash isn't 64, so the parameter is a height, else, the hex blob
    return postData("getblock", blockHash.length != 64 ? {height: blockHash} : {hash: blockHash})
}

export function getTxsPool()
{
    return postData("gettxpool")
}

export async function postData(method, params)
{
    if (!params)
        params = {}

    return fetch(daemon, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({jsonrpc: '2.0', id:'1', method: method, params: params}),
    }
    ).then(result => result.json()).then(result => result.result);
}