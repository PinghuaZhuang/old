define( [
    'echarts',
    './option'
], function ( echarts, option ) {
    'use strict';

    // 初始化
    let chart = echarts.init( document.querySelector( '#check' ), null, {
        devicePixelRatio: 2
    } );

    chart.setOption( option );
} );
