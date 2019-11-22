/**
 * @file 创建 series 配置项
 */
define( [], function () {
    'use strict';

    return function ( count, _fn ) {
        let i = 0, series = [];

        while ( i < count ) {
            series.push( _fn( i++ ) );
        }

        return series;
    };
} );
