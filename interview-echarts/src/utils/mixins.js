/**
 * @file option 多次重复配置
 */
define( [], function () {
    'use strict';

    let axis = {
        axisLine: {
            show: true,
            lineStyle: {
                color: '#dfdfdf'
            },
            width: 1
        },
        axisTick: {
            show: true,
            inside: true,
            length: 3
        },
        axisLabel: {
            color: '#666',
            fontSize: 12
        }
    };

    return {
        xAxis: axis,
        yAxis: { ...axis, axisTick: {
            show: false
        } },
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
            top: 10,
            bottom: 30,
            left: 30
        }
    };
} );
