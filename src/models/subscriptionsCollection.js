Array.prototype.last = function () {
    return this.length > 0 ? this[this.length - 1] : undefined;
};

class SubscriptionsCollection {
    constructor(subscriptionsData) {
        const eventMap = new Map();

        subscriptionsData.forEach(sub => {
            const topic = sub.topic.split("_");
            const producerName = topic[0].split(":").last();
            const eventName = topic[1];
            const consumerName = sub.endpoint.split(":").last();

            if (!eventMap.get(eventName)) {
                eventMap.set(eventName, {
                    producerName,
                    eventName,
                    topic: sub.topic,
                    destinations: [],
                })
            }

            eventMap.get(eventName).destinations.push({
                consumerName,
                endpoint: sub.endpoint,
            });
        });

        this.eventMap = eventMap;
    }

    forEachEvent(consumer) {
        for (const event of this.eventMap.entries()) {
            consumer(event[1]);
        }
    }

    totalConsumedEvents() {
        let total = 0;

        for (const event of this.eventMap.entries()) {
            total += event[1].destinations.length;
        }

        return total;
    }

    findByType(type, name) {
        const method = "findBy" + type.charAt(0).toUpperCase() + type.slice(1);
        return this[method](name);
    }

    findByProducer(name) {
        return Array.from(this.eventMap)
            .filter(entry => entry[1].producerName == name)
            .map(entry => entry[1]);
    }

    findByEvent(name) {
        return [this.eventMap.get(name)];
    }

    findByConsumer(name) {
        return Array.from(this.eventMap)
            .filter(entry => {
                let found = entry[1].destinations.filter(destination => {
                    return destination.consumerName == name;
                })

                return found.length > 0;
            })
            .map(entry => entry[1]);
    }
}

export {
    SubscriptionsCollection
}
