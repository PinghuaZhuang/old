import PlainObj from '../abs/PlainObj'
import z from 'zp-z'
console.log( 'z', z )

export default class Emitter extends PlainObj {

    constructor ( opt = {} ) {
        super( opt )

        if ( 'config' in opt ) {
            this.config = opt.config // Callbacks 的配置
        }

        Object.assign( this, {
            _callbacks: {},
        } )
    }

    static Callback = z.Callback

    /**
     * 注册事件
     * @param { String } type 事件类型
     * @param { ...Function } fn 事件回调
     */
    on ( type, ...fn ) {
        if ( this._callbacks[ type ] == null ) {
            this._callbacks[ type ] = z.Callback( this.config )
        }
        this._callbacks[ type ].add( ...fn )
    }

    /**
     * 注销事件
     * @param { String } type 事件类型
     * @param { ...Function } fn 主要注销的事件地址
     */
    off ( type, ...fn ) {
        if ( this._callbacks[ type ] == null ) {
            return null
        }

        this._callbacks[ type ].remove( ...fn )
    }

    /**
     * 触发事件
     * @param { Event } event 事件对象
     */
    trigger ( event ) {
        if ( typeof event !== 'object' ) {
            throw new Error( `<<< event is object.` )
        }

        if ( this._callbacks[ event.type ] == null ) {
            return null
        }

        try {
            this._callbacks[ event.type ].fire( event )
        } catch ( error ) {
            console.error( `<<< Catch event error: ${event.type}, ${error}` )
        }

        return this
    }
}
