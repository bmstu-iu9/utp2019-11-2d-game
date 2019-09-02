'use strict';

export class Vector2 {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    };

    copy(vector) {
        for (let iter in vector) {
            this[iter] = vector[iter];
        }
    };
};