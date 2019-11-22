define( [
    './colors',
    './mork',
    '../../utils/mixins',
    '../../utils/createSeries'
], function ( colors, mork, mixins, createSeries ) {
    'use strict';

    let names = '东明挖断 盾构断 西明挖断'.split( /\s+/ );

    let series = createSeries( 3, index => ( {
        name: names[ index ],
        type: 'line',
        symbol: 'circle',
        lineStyle: {
            width: 2
        },
        itemStyle: {
            borderWidth: 2,
            borderColor: '#fff'
        },
        symbolSize: 8,
        yAxisIndex: 0,
        data: mork[ index ]
    } ) );

    return {
        ...mixins,
        color: colors,
        xAxis: [
            {
                ...mixins.xAxis,
                type: 'category',
                data: [ '4 8', '4 9', '4 10', '4 11', '4 12', '4 13', '4 14' ],
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                ...mixins.yAxis,
                type: 'value',
                name: '水量',
                min: 0,
                max: 100,
                interval: 20,
                axisLine: {
                    show: false
                }
            }
        ],
        series
    };
} );
