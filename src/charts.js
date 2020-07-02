/* eslint-disable no-console */
import * as explorer from './explorer'

const cache = {
    depth: 0,
    info: {},
    blocks: []
}
export async function init(depth = 100, n = 1000)
{
    let info = await explorer.getInfo()
    cache.info = info
    cache.depth = depth
    cache.n = n
    cache.blocks = await explorer.getBlocks(cache.info.topoheight, cache.depth, cache.n)
}

function createChart(title, name, categories = [], data = [])
{
    const options = {
        chart: {
          type: 'line',
          toolbar: {
              show: false
          },
          shadow: {
            enabled: false,
            color: 'red',
            top: 3,
            left: 2,
            blur: 3,
            opacity: 1
          }
        },
        theme: {
            mode: 'dark', 
            palette: 'palette1', 
            monochrome: {
                enabled: false,
                color: '#255aee',
                shadeTo: 'dark',
                shadeIntensity: 0.65
            },
        },
        
        xaxis: {
          type: 'string',
          categories: [],
          labels: {
              show: false
          }
        },
        markers: {
            colors: ['black']
        },
        fill: {
          type: 'solid',
          /*gradient: {
            shade: 'dark',
            gradientToColors: ['#FDD835'],
            shadeIntensity: 1,
            type: 'horizontal',
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100]
          },*/
        }
    }
    options.xaxis.categories = categories

    return {
        datas: [{
            name: name,
            data: data
        }],
        options: options
    }
}

export function difficultyChart()
{    
    const categories = []
    const data = []
    let val = getDifficulty()
    
    for (let i = 0; i < cache.depth; i++)
    {
        categories.push(explorer.formatSupply(val[i].height))
        data.push(val[i].difficulty)
    }

    return createChart("Difficulty Chart", "Difficulty", categories, data)
}

export function rewardChart()
{    
    const categories = []
    const data = []
    let val = getRewards()
    
    for (let i = 0; i < cache.depth; i++)
    {
        categories.push(explorer.formatSupply(val[i].height))
        data.push(val[i].reward)
    }

    return createChart("Reward Chart", "Reward", categories, data)
}

export function hashrateChart()
{    
    const categories = []
    const data = []
    let val = getHashrates()
    
    for (let i = 0; i < cache.depth; i++)
    {
        categories.push(explorer.formatSupply(val[i].height))
        data.push(val[i].hashrate)
    }

    return createChart("Hashrate Chart", "MH/s", categories, data)
}

function getDifficulty()
{
    const array = []

    for (let i = 0; i < cache.depth; i++)
    {
        let block = cache.blocks[i]
        array.push({height: block.height, difficulty: block.difficulty})
    }

    return array
}

function getHashrates()
{
    const array = []

    for (let i = 0; i < cache.depth; i++)
    {
        let block = cache.blocks[i]
        array.push({height: block.height, hashrate: (block.difficulty/(cache.info.target*1000*1000)).toFixed(2)})
    }

    return array
}

function getRewards()
{
    const array = []

    for (let i = 0; i < cache.depth; i++)
    {
        let block = cache.blocks[i]
        array.push({height: block.height, reward: block.reward})
    }

    return array
}