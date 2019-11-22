import PlainObj from '../Abs/PlainObj'

const _arr = Symbol( 'arry' )

function popOrShif ( arr = [], count, method ) {
    let ret = [], i = count
    while ( i-- > 0 ) {
        ret.push( arr[ method ]() )
    }
    return count === 1 ? ret[ 0 ] : ret
}

function pushOrUnshift ( arr, items, type, method ) {
    items.forEach( ( item ) => {
        if ( typeof type === 'function' ) {
            if ( item.constructor === type ) {
                arr[ method ]( item )
            }
        } else {
            arr[ method ]( item )
        }
    } )
    return arr.length
}

export default class Arr extends PlainObj {

    /**
     * 初始化只能传入元素
     * @param { Array } items
     * @param { Constructor } type 每个元素的类型( 构造函数 ), 不是必须
     */
    constructor ( items = [], { type, _des } = {} ) {
        super( { _des, items, type } )

        this[ _arr ] = []
        this.type = type

        this.push( ...items )
    }

    /**
     * @return { Number }
     */
    get length () {
        return this[ _arr ].length
    }

    /**
     * 根据索引获取元素
     * @return { Any }
     * index < 0 反序号
     */
    get ( index ) {
        if ( index < 0 ) {
            index = this.length + index
        }
        return this[ _arr ][ index ]
    }

    push ( ...items ) {
        return this._push( ...items )
    }

    unshift ( ...items ) {
        return this._unshift( ...items )
    }

    pop ( count ) {
        return Arr.pop( this[ _arr ], count )
    }

    shift ( count ) {
        return Arr.shift( this[ _arr ], count )
    }

    valueOf () {
        return this.get( 0 )
    }

    _push ( ...items ) {
        return pushOrUnshift( this[ _arr ], items, this.type, 'push' )
    }

    _unshift ( ...items ) {
        return pushOrUnshift( this[ _arr ], items, this.type, 'unshift' )
    }

    static pop ( arr = [], count = 1 ) {
        return popOrShif( arr, count, 'pop' )
    }

    static shift ( arr = [], count = 1 ) {
        return popOrShif( arr, count, 'shift' )
    }
}
