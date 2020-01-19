class Item {
    constructor(data) {
        return {
            next: undefined,
            data
        }
    }
}

class Queue {
    next = undefined;
    last = undefined;
    length = 0;

    dequeue() {
        const ret = this.next;
        this.next = this.next.next;
        if (this.last === ret) {
            this.last = undefined;
        }
        --this.length
        return ret.data;
    }

    queue(data) {
        const item = new Item(data);
        if (this.last) {
            this.last.next = item;
        } else {
            this.next = item;
            this.last = this.next;
        }
        this.last = item;
        ++this.length;
    }
}

module.exports = Queue;