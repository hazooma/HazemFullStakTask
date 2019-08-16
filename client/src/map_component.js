/* global fetch, L */
import React, { useEffect, useRef, useState } from "react";
import Moment from "moment";
import colors from "./colors.json";
import DatePicker from "./TimePickerComponent.js";
const getRouteSummary = locations => {
  const to = Moment(locations[0].time).format("hh:mm DD.MM");
  const from = Moment(locations[locations.length - 1].time).format(
    "hh:mm DD.MM"
  );
  return `${from} - ${to}`;
};

const MapComponent = props => {
  const map = useRef();
  const [locations, setLocations] = useState();
  const [link, setLink] = useState("http://localhost:3000");
  const handler = input => {
    setLink("http://localhost:3000/location/2019-07-23T18:25:52.148Z");
  };
  // Request location data.
  useEffect(() => {
    fetch(link)
      .then(response => response.json())
      .then(json => {
        setLocations(json);
      });
  }, [link]);
  // TODO(Task 2): Request location closest to specified datetime from the back-end.

  // Initialize map. always fixed
  useEffect(() => {
    map.current = new L.Map("mapid");
    const osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    const attribution =
      'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    const osm = new L.TileLayer(osmUrl, {
      minZoom: 8,
      maxZoom: 12,
      attribution
    });
    map.current.setView(new L.LatLng(52.51, 13.4), 9);
    map.current.addLayer(osm);
  }, []);

  // Update location data on map.
  useEffect(() => {
    if (!map.current || !locations) {
      return; // If map or locations not loaded yet.
    }

    locations.forEach(segment => {
      // TODO(Task 1): Replace the single red polyline by the different segments on the map.
      const latlons = segment.locations.map(({ lat, lon }) => [lat, lon]);
      console.log(segment);
      const polyline = L.polyline(latlons, {
        color: colors[segment.segmentNumber] || "black"
      })
        .bindPopup(getRouteSummary(segment.locations))
        .addTo(map.current);
      map.current.fitBounds(polyline.getBounds());
    });

    return () => map.current.remove(polyline);
  }, [locations, map.current]);
  // TODO(Task 2): Display location that the back-end returned on the map as a marker.

  return (
    <div>
      <DatePicker handle={handler} />
      {locations && `${locations.length} locations loaded`}
      {!locations && "Loading..."}
      <div id="mapid" />
    </div>
  );
};

export default MapComponent;
