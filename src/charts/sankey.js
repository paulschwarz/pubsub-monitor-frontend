import { GoogleCharts } from "google-charts";

const drawChart = (container, subscriptionsCollection) => {
    const data = new google.visualization.DataTable();
    data.addColumn("string", "From");
    data.addColumn("string", "To");
    data.addColumn("number", "Weight");

    // Add rows of data.
    subscriptionsCollection.forEachEvent(sub => {
        data.addRow([
            labelProducer(sub.producerName),
            labelEvent(sub.eventName),
            sub.destinations.length]);

        sub.destinations.forEach(destination => {
            data.addRow([
                labelEvent(sub.eventName),
                labelConsumer(destination.consumerName),
                1]);
        })
    });

    // Sets chart options.
    var colors = ["#a6cee3", "#b2df8a", "#fb9a99", "#fdbf6f",
        "#cab2d6", "#ffff99", "#1f78b4", "#33a02c"];

    var options = {
        sankey: {
            node: {
                colors: colors,
                nodePadding: 80,
                width: 20,
                interactivity: true,
                label: {
                    fontSize: 12,
                    fontName: "Source Code Pro",
                },
            },
            link: {
                colorMode: "gradient",
                colors: colors
            },
        },
    };

    // Instantiates and draws our chart, passing in some options.
    var chart = new google.visualization.Sankey(container);
    chart.draw(data, options);

    // Every time the table fires the "select" event, it should call your
    // selectHandler() function.
    google.visualization.events.addListener(chart, "select", selectHandler);

    function selectHandler(e) {
        if (chart.getSelection().length == 0) return;

        const selection = chart.getSelection()[0].name;
        const type = getSelectedType(selection);
        const name = selection.trim();

        const subscription = subscriptionsCollection.findByType(type, name);

        console.log(name, type, subscription);
    }

    // Trick to distinguish producters, consumers and events

    function getSelectedType(selection) {
        if (/\s\w+/.test(selection)) return "consumer";
        else if (/\w+\s/.test(selection)) return "producer";
        else return "event";
    }

    function labelProducer(name) { return name + " " }
    function labelEvent(name) { return name }
    function labelConsumer(name) { return " " + name }
}

const render = (container, subscriptions) => {
    GoogleCharts.load(() => drawChart(container, subscriptions), { "packages": ["sankey"] });
}

export {
    render
}
