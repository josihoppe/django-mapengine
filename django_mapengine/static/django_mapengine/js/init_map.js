
const map = createMap();
add_images();

map.on("load", function () {
  PubSub.publish(eventTopics.MAP_LOADED);
});

PubSub.subscribe(eventTopics.MAP_LOADED, add_sources);
PubSub.subscribe(eventTopics.MAP_LOADED, add_satellite);


function createMap() {
    const setup = JSON.parse(document.getElementById("map_setup").textContent);
    const map = new maplibregl.Map(setup);

    if (store.cold.debugMode) {
        map.showTileBoundaries = true;
      }

    const nav = new maplibregl.NavigationControl();
    map.addControl(nav, "bottom-left");
    map.addControl(new maplibregl.ScaleControl({position: 'bottom-right'}));
    return map;
}

function add_satellite(msg) {
    const layers = map.getStyle().layers;
    // Find the index of the first symbol layer in the map style
    let firstSymbolId;
    for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === "symbol") {
            firstSymbolId = layers[i].id;
            break;
        }
    }
    map.addLayer(
        {
            id: "satellite",
            type: "raster",
            source: "satellite"
        },
        firstSymbolId
    );
    map.setLayoutProperty("satellite", "visibility", "none");
    return logMessage(msg);
}

function add_sources(msg) {
    const sources = JSON.parse(document.getElementById("map_sources").textContent);
    for (const source in sources) {
        map.addSource(source, sources[source]);
    }
    PubSub.publish(eventTopics.MAP_SOURCES_LOADED);
    return logMessage(msg);
}

function add_images(msg) {
    const map_images = JSON.parse(document.getElementById("map_images").textContent);
    for (const map_image in map_images) {
        map.loadImage(map_image.path, function (error, image) {
            if (error) throw error;
            map.addImage(map_image.name, image);
        });
    }
}
