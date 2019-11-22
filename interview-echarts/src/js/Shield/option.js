define( [
    './colors',
    './mork',
    '../../utils/mixins',
    '../../utils/createSeries'
], function ( colors, mork, mixins, createSeries ) {
    'use strict';

    let series = createSeries( 3, index => ( {
        symbolSize: 12,
        data: mork[ index ],
        type: 'scatter',
        itemStyle: {
            color: colors.bg[ index ]
        },
        markArea: {
            silent: true,
            itemStyle: {
                normal: {
                    color: 'transparent',
                    borderWidth: 2,
                    borderType: 'solid',
                    borderColor: colors.area[ index ]
                }
            },
            data: [ [ {

                // name: '女性分布区间',
                xAxis: -( 100 - index * 25 ),
                yAxis: -( 100 - index * 25 )
            }, {
                xAxis: ( 100 - index * 25 ),
                yAxis: ( 100 - index * 25 )
            } ] ]
        }
    } ) );

    return {
        ...mixins,
        colors,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        grid: {
            top: 30,
            bottom: 30,
            left: 30
        },
        xAxis: {
            ...mixins.xAxis,
            name: '高层偏差',
            nameLocation: 'end',
            nameRotate: -90,
            nameTextStyle: {
                color: '#666'
            }
        },
        yAxis: [
            {
                ...mixins.yAxis,
                type: 'value',
                name: '水量',
                min: -150,
                max: 150,
                interval: 50,
                name: '平面偏差',
                nameLocation: 'end',
                nameTextStyle: {
                    color: '#666'
                }
            }
        ],
        series
    };
} );
