import PlainObj from '../abs/PlainObj'
import Emitter from './Emitter'
import z from 'zp-z'

export default class Sensor extends PlainObj {
    static type = 'sensor'

    constructor ( container = [], option ) {
        super( option )
        if ( !z.isArray( container ) ) {
            container = [ container ]
        }
        this.container = [ ...container ]
        // this.option = { ...option }
        this.$emitter = new Emitter()
    }

    /**
     * 返回事件类型
     * @return { String }
     */
    get type () {
        return this.constructor.type
    }

    /**
     * 注册
     */
    attach() {
        return this._attach()
    }

    /**
     * 删除
     */
    detach() {
        return this._detach()
    }

    on ( type, ...fn ) {
        this.$emitter.on( type, ...fn )
        return this
    }

    off ( type, ...fn ) {
        this.$emitter.off( type, ...fn )
        return this
    }

    /**
     * 触发事件
     * @param { Element } element 触发对象, DOM 元素
     * @param { SensorEvent } sensorEvent 事件对象
     */
    trigger ( element, sensorEvent, ...rest ) {

        if ( element == null || !element.dispatchEvent ) {
            // let event = element, param1 = sensorEvent
            // this.$emitter.trigger( event, param1, ...rest  )
            return
        }

        const event = document.createEvent( 'Event' )
        event.detail = sensorEvent
        event.initEvent( sensorEvent.type, true, true )
        element.dispatchEvent( event )
        // this.lastEvent = sensorEvent
        return this
    }

    /* =========================================== */

    _attach () {
        return this
    }

    _detach() {
        return this
    }
}
