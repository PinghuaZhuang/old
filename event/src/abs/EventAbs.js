import PlainObj from './PlainObj'

const canceled = Symbol( 'canceled' )

export default class AbstractEvent extends PlainObj {

    static type = 'custom-event' // 事件类型

    // // static cancelable = false // 是否阻止冒泡

    constructor ( data = {} ) {
        super( data )
        // this[ canceled ] = false
        this.data = data
    }

    /**
     * 获取事件类型
     */
    get type () {
        return this.constructor.type
    }
}
