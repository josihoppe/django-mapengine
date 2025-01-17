
const map_store = initStore();
const map = initMap();


function initMap() {
    const setup = JSON.parse(document.getElementById("mapengine_setup").textContent);
    const map = new maplibregl.Map(setup);

    if (map_store.cold.debugMode) {
        map.showTileBoundaries = true;
      }

    // Disable zoom on double click
    map.doubleClickZoom.disable();

    // Zoom to feature on click
      map.on("click", function (element) {
        flyToElement(element);
      });

    const nav = new maplibregl.NavigationControl();
    map.addControl(nav, "bottom-left");
    map.addControl(new maplibregl.ScaleControl({position: 'bottom-right'}));
    return map;
}


function initStore() {
    const storeColdInit = JSON.parse(document.getElementById("mapengine_store_cold_init").textContent);
    storeColdInit.state = {};
    storeColdInit.storedChoroplethPaintProperties = {"default": {}};
    for (const choroplethName in storeColdInit.choropleths) {
        storeColdInit.storedChoroplethPaintProperties[choroplethName] = {};
    }
    storeColdInit.currentChoropleth = null;
    return new Store(storeColdInit);
}