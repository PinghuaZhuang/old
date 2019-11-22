
const exclude = [ 'constructor' ]

export default class PlainObj {

    constructor ( data = {}, option ) {
        let { _des } = data
        Object.assign( this, {
            _des, _params: data
        } )

        if ( option ) {
            this.option = { ...option }
        }
    }

    /**
     * 返回实例的说有方法组成的数组
     * @return { Array<String> }
     */
    functions () {
        let props = []
        Object.getOwnPropertyNames( this ).forEach( ( prop ) => {
            if ( typeof this[ prop ] === 'function' && !exclude.includes( prop ) ) {
                props.push( prop )
            }
        } )
        return props
    }

    /**
     * 混合函数
     * @param { PlainObj } target
     */
    mixin ( target ) {
        target = target || this
        return PlainObj.mixin( this, target )
    }

    /**
     * 混合函数
     * @param { Object } _self
     * @param { PlainObj } target
     */
    static mixin ( _self, target ) {

        target.functions().forEach( ( prop ) => {
            _self[ `_${prop}` ] = target[ prop ]
        } )

        return _self
    }
}
