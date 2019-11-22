define( [], function () {
    'use strict';

    let data1 = [
        -1, -.8, .2, 0, .2,
        -.1, 0, 1, .5, .3,
        -.1, -.9, -1.1, 1.1, 2,
        2.3, 2.8, 2, 1.5
    ];

    data1 = converData( data1 );

    let data2 = [

        // .5, .3, -.1, -.9,
        // -1.1, 1.1, 2, .5, .3,
        // -.1, -.9, -1.1, 1.1, 2,
        // .5, .3, -.1, -.9
    ];

    data2 = converData( data2 );

    function converData ( data ) {
        return data.map( ( el, index ) => {
            if ( index % 2 ) {
                return {
                    value: el,
                    symbol: 'none'
                };
            }
            return el;
        } );
    }

    return [ data1, data2 ];
} );
