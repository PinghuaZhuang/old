import PlainObj from '../Abs/PlainObj'

export const _resolve = Symbol( 'resolve' )
export const _reject = Symbol( 'reject' )

export default class Async extends PlainObj {

    constructor ( opt = {} ) {
        super( opt )

        this.promise = new Promise( ( resolve, reject ) => {
            this[ _resolve ] = resolve
            this[ _reject ] = reject
        } )

        this.then = this.promise.then
        this.then = this.then.bind( this.promise )
        this.catch = this.promise.catch
        this.catch = this.catch.bind( this.promise )
    }

    done ( fn ) {
        let promise = new Async( this._opt )
        this.then( ( ...rest ) => {
            fn( ...rest )
            promise.start( ...rest )
        } ).catch( ( ...rest ) => {
            // this[ _reject ]()
            promise[ _reject ]( ...rest )
        } )
        promise.promise
            .catch( ( ...rest ) => new Promise( ( _, reject ) => { /* reject( ...rest ) */ } ) )
        return promise
    }

    fail ( fn ) {
        let promise = new Async( this._opt )
        this.catch( ( ...rest ) => {
            fn( ...rest )
            promise[ _reject ]( ...rest )
        } )
        promise.promise
            .catch( ( ...rest ) => new Promise( ( _, reject ) => { /* reject( ...rest ) */ } ) )
        return promise
    }

    start ( fn, ...rest ) {
        return this._start( fn, ...rest )
    }

    /**
     * @param { Async } promise
     */
    chain ( promise ) {
        this.done( ( ...rest ) => promise.start( ...rest ) )
        return this
    }

    /* ============================== */

    /**
     * @param { Function|Any } fn
     */
    _start ( fn = ( resolve ) => resolve(), ...rest ) {

        if ( typeof fn === 'function' ) {
            fn ( this[ _resolve ] )
        } else {
            this[ _resolve ]( fn, ...rest )
        }

        return this
    }
}
