define( [
    './colors',
    './mork',
    '../../utils/mixins',
    '../../utils/createSeries',
    '../../utils/colorOpt'
], function ( colors, mork, mixins, createSeries, colorOpt ) {
    'use strict';

    let names = '总包单位 监理单位 建设单位 质量巡查'.split( /\s/ );

    let _color = ( function () {
        let i = 0, res = [];

        while ( i < 3 ) {
            res.push( {
                ...colorOpt,
                colorStops: [ {
                    offset: 0, color: colors[ 1 ][ i ]
                }, {
                    offset: 1, color: colors[ 0 ][ i ]
                } ]
            } );

            i++;
        }
        return res;
    } )();

    let series = createSeries( 3, index => ( {
        name: names[ index ],
        type: 'bar',
        itemStyle: {
            barBorderRadius: [ 5, 5, 0, 0 ]
        },
        barWidth: 10,
        data: mork[ index ]
    } ) );

    series[ 3 ] = {
        name: names[ 3 ],
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
        data: mork[ 3 ]
    };

    return {
        ...mixins,
        color: [
            ..._color,
            colors[ 0 ][ 3 ]
        ],
        grid: {
            top: 10,
            bottom: 30,
            left: 30
        },
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
