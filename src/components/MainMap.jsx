import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import '../../node_modules/leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const tiles = "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
const stamenTonerAttr = 'change this';
const zoomLevel = 12;
const FCENLocation = [39.9528, -75.1638];


class MainMap extends Component {
    state = {
      currentPosition : FCENLocation
    }

    componentDidMount() {
        this.updateCurrentPosition()
    }

    //TODO update every 10 seconds
    updateCurrentPosition = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState((state, props) =>
          ({
            currentPosition: [position.coords.latitude, position.coords.longitude],
          })
        )
      })
    }

    getMarkers = function() {
        let markers = this.props.markers.map(marker =>
            <Marker key={marker.key} position={marker.position} >
                <Popup>{marker.popUpContent}</Popup>
            </Marker>
        )

        if(this.props.ShowMyPosition) {
          const myPostionMarker = (
            <Marker key={"mapCenter"} position={this.state.currentPosition} >
                <Popup>{ (<div> Title: MyPosition </div>)}</Popup>
            </Marker>
          )
          markers.push(myPostionMarker)
        }

        return markers
    }
    //Events

    onClick = e => {
        let { onClick } = this.props
        onClick && onClick(e.latlng)
    }

    onContextMenu = e => {
        alert("Testing context menu event")
    }

    render() {
        return (
            <Map
                center={this.state.currentPosition}
                zoom={zoomLevel}
                style={{ height: '200px', ...this.props.style }}
                onClick={this.onClick}
                onContextMenu={this.onContextMenu}
            >
                <TileLayer
                    attribution={stamenTonerAttr}
                    url={tiles}
                />
                {this.props.markers && this.getMarkers()}
            </Map>
        );
    }
}

export default MainMap;
