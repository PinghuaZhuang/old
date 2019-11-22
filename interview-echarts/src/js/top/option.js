define( [
    './colors',
    './mork',
    '../../utils/mixins',
    '../../utils/createSeries'
], function ( colors, mork, mixins, createSeries ) {
    'use strict';

    let names = '直接访问 邮件营销 联盟广告 视频广告'.split( /\s/ );

    let series = createSeries( 4, index => ( {
        name: names[ index ],
        type: 'bar',
        stack: '总量',
        label: {
            normal: {
                show: true,
                align: 'center',
                fontFamily: 'MyriadPro Regular',
                fontSize: 12
            }
        },
        itemStyle: {
            color: colors[ index ]
        },
        barWidth: 14,
        barCategoryGap: 12,
        data: mork[ index ]
    } ) );

    series[ 3 ].itemStyle.barBorderRadius = [ 0, 7, 7, 0 ];

    return {
        ...mixins,
        colors,
        yAxis: {
            ...mixins.yAxis,
            type: 'category',
            data: [ '盾构施工', '管片工程', '箱涵工程', '车道板工程',
                '内部结构', '洞门工程', '洞门工程', '地基基础',
                '主题结构', '防水工程' ],

            axisLine: {
                show: false
            }
        },
        grid: {
            top: 10,
            bottom: 30,
            left: 70
        },
        series
    };
} );
