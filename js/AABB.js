'use strict';

export class AABB { //хит бокс
    constructor(center, halfSize) { //конструктор
        this.center = center; //центр прямоугольника
        this.halfSize = halfSize; //полу длинаа
    }

    overlaps(other) { //пересекаются ли прямоугольники
        return !(Math.abs(this.center.x - other.center.x) > this.halfSize.x + other.halfSize.x) &&
            !(Math.abs(this.center.y - other.center.y) > this.halfSize.y + other.halfSize.y);
    }
};