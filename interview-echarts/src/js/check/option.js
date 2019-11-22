define( [
    './colors',
    './mork',
    '../../utils/colorOpt',
    '../../utils/mixins',
    '../../utils/createSeries'
], function ( colors, mork, colorStops, mixins, createSeries ) {
    'use strict';

    let series = createSeries( 2, index => ( {
        name: '01',
        type: 'bar',
        label: {
            normal: {
                show: false,
                position: 'insideRight'
            }
        },
        itemStyle: {
            color: {
                ...colorStops,
                colorStops: [ {
                    offset: 0, color: colors[ index ][ 0 ]
                }, {
                    offset: 1, color: colors[ index ][ 1 ]
                } ]
            },
            barBorderRadius: [ 10, 10, 0, 0 ]
        },
        barGap: '-100%',
        barWidth: 20,
        data: mork[ index ]
    } ) );

    return {
        ...mixins,
        colors,
        xAxis: {
            type: 'category',
            data: [ '4 8', '4 9', '4 10', '4 11', '4 12', '4 13', '4 14' ],
            ...mixins.xAxis
        },
        yAxis: {
            ...mixins.yAxis,
            axisLine: {
                show: false
            },
            min: 0,
            max: 70,
            interval: 10
        },
        series
    };
} );
