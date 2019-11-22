import SensorEvent from '../class/SensorEvent'

export class MoveRight extends SensorEvent {
    static type = 'move:right'
}

export class MoveLeft extends SensorEvent {
    static type = 'move:left'
}
