import "./style.css";

const SankeyChart = require("./charts/sankey");
const subscriptionsRepository = require("./repositories/subscriptionsRepository");
const SubscriptionsCollection = require("./models/subscriptionsCollection").SubscriptionsCollection;

const createContainer = (parent, subscriptionsCollection) => {
    var container = document.createElement("div");
    container.style.cssText = "position:absolute;z-index:100;background:#fff;width:1000px;";
    container.style.height = (subscriptionsCollection.totalConsumedEvents() * 42) + "px";
    parent.appendChild(container);

    return container;
}

subscriptionsRepository
    .all()
    .then((subscriptions) => {
        const subscriptionsCollection = new SubscriptionsCollection(subscriptions);
        const container = createContainer(document.body, subscriptionsCollection);
        SankeyChart.render(container, subscriptionsCollection);
    });
