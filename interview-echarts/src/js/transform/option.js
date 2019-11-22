define( [
    './colors',
    './mork',
    '../../utils/createSeries',
    '../../utils/colorOpt',
    '../../utils/mixins'
], function ( colors, mork, createSeries, colorOpt, mixins ) {
    'use strict';

    let series = createSeries( 2, index => ( {
        name: '0' + index,
        symbol: 'circle',
        type: 'line',
        lineStyle: {
            width: 2
        },
        itemStyle: {
            borderWidth: 2,
            borderColor: '#fff',
            color: colors[ index ]
        },
        symbolSize: 8,
        data: mork[ index ],
        markPoint: {
            data: [
                { type: 'max', name: '最大值' },
                { type: 'min', name: '最小值' }
            ],
            symbolSize: 40,
            symbolOffset: [ 0, 0 ],
            label: {
                normal: {
                    show: true,
                    align: 'center',
                    fontFamily: 'MyriadPro Regular',
                    fontSize: 12
                }
            }
        },
        markLine: {
            data: [
                {
                    name: '_zero',
                    yAxis: 0
                }
            ],
            lineStyle: {
                type: 'solid',
                width: 1.5
            },
            label: {
                normal: {
                    show: false,
                    fontFamily: 'Arial BoldMT',
                    fontSize: 12,
                    position: 'end'
                }
            },
            symbol: 'none'
        }
    } ) );

    let { markLine } = series[ 1 ];
    markLine.data[ 0 ].yAxis = 3;
    markLine.data[ 1 ] = { yAxis: -3 };
    markLine.label.normal.show = true;

    return {
        ...mixins,
        xAxis: {
            ...mixins.xAxis,
            type: 'category',
            boundaryGap: false,
            axisLine: {
                ...mixins.xAxis.axisLine,
                onZero: false
            },
            data: [ 'X-1', '', 'X-3', '', 'X-5', '', 'X-7', '', 'X-9', '',
                'X-11', '', 'X-13', '', 'X-15', '', 'X-17', '', 'X-19' ]
        },
        yAxis: {
            ...mixins.yAxis,
            min: -5,
            max: 5,
            interval: 2,
            name: '椭圆度(%)',
            nameTextStyle: {
                color: '#666'
            }
        },
        grid: {
            top: 30,
            bottom: 30,
            left: 30
        },
        series
    };
} );
