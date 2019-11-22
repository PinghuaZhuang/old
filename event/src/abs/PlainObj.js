
export default class PlainObj {

    constructor ( data = {} ) {
        if ( data._des != null ) {
            this._des = data._des
        }
        Object.assign( this, {
            _params: data
        } )
    }
}
