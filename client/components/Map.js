import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import MapGL, {
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  FlyToInterpolator
} from 'react-map-gl'
import NationalViewButton from './NationalViewButton'
import Pins from './pins'
import JobInfo from './job-info'
import JobDetails from './job-details'

const TOKEN =
  'pk.eyJ1IjoiYm91c3RhbmlwNzE4IiwiYSI6ImNrZndwa2MweTE1bDkzMHA5NTdvMWxjZHUifQ.zY3GvA4Jq0g5I22NoPCt-Q'

const geolocateStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '10px'
}

const nationalViewStyle = {
  position: 'absolute',
  top: 36,
  left: 0,
  width: '49px',
  height: '49px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const fullscreenControlStyle = {
  position: 'absolute',
  top: 72,
  left: 0,
  padding: '10px'
}

const navStyle = {
  position: 'absolute',
  top: 108,
  left: 0,
  padding: '10px'
}

const scaleControlStyle = {
  position: 'absolute',
  bottom: 36,
  left: 0,
  padding: '10px'
}

const defaultViewport = {
  latitude: 37.785164,
  longitude: -85,
  zoom: 3.5,
  bearing: 0,
  pitch: 0
}

export class Map extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      viewport: defaultViewport,
      popupInfo: null,
      hoverInfo: null
    }
    this._goToNewView = this._goToNewView.bind(this)
  }

  componentDidUpdate(prevProps) {
    const {selectedState} = this.props
    if (prevProps.selectedState !== selectedState) {
      if (selectedState === 'USA') {
        this._goToNewView(defaultViewport)
      } else {
        console.log('Time to transition to', selectedState, 'view.')
      }
    }
  }

  _updateViewport = viewport => {
    this.setState({viewport})
  }

  _onClickMarker = job => {
    this.setState({popupInfo: job})
  }

  _onHoverMarker = job => {
    this.setState({hoverInfo: job})
  }

  _onLeaveHover = () => {
    this.setState({hoverInfo: null})
  }

  _onClickAwayPopup = () => {
    this.setState({popupInfo: null})
  }

  _goToNewView = stateViewport => {
    this.setState({
      viewport: {
        ...stateViewport,
        transitionDuration: 1500,
        transitionInterpolator: new FlyToInterpolator()
      }
    })
  }

  _renderPopup() {
    const {popupInfo} = this.state

    return (
      popupInfo && (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          closeOnClick={true}
          onClose={() => this.setState({popupInfo: null})}
        >
          <JobDetails info={popupInfo} onClickAway={this._onClickAwayPopup} />
        </Popup>
      )
    )
  }

  _renderHover() {
    const {hoverInfo, popupInfo} = this.state
    return (
      hoverInfo &&
      hoverInfo !== popupInfo && (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={hoverInfo.longitude}
          latitude={hoverInfo.latitude}
          closeOnClick={false}
        >
          <JobInfo info={hoverInfo} />
        </Popup>
      )
    )
  }

  render() {
    const {viewport} = this.state
    const jobs = this.props.jobs.jobs

    return (
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={this._updateViewport}
        mapboxApiAccessToken={TOKEN}
      >
        <Pins
          jobs={jobs}
          onClick={this._onClickMarker}
          onMouseEnter={this._onHoverMarker}
          onMouseLeave={this._onLeaveHover}
        />

        {this._renderPopup()}
        {this._renderHover()}

        <div style={geolocateStyle}>
          <GeolocateControl />
        </div>
        <div style={nationalViewStyle}>
          <NationalViewButton
            goToNational={() => this._goToNewView(defaultViewport)}
          />
        </div>
        <div style={fullscreenControlStyle}>
          <FullscreenControl />
        </div>
        <div style={navStyle}>
          <NavigationControl />
        </div>
        <div style={scaleControlStyle}>
          <ScaleControl />
        </div>
      </MapGL>
    )
  }
}

const mapStateToProps = state => {
  return {
    selectedState: state.selectedState
  }
}

export default connect(mapStateToProps)(Map)

// Reference (code above):
// https://github.com/visgl/react-map-gl/tree/5.2-release/examples/controls
// https://visgl.github.io/react-map-gl/examples

// ------------------------------------------------------------------------------------------------------------------------------
// Agne's other code with hooks, just in case:

// import React, {useState, useEffect} from 'react'
// import MapGL from 'react-map-gl';
// import Pins from './pins';

// const MAPBOX_TOKEN = 'pk.eyJ1IjoiYm91c3RhbmlwNzE4IiwiYSI6ImNrZndwa2MweTE1bDkzMHA5NTdvMWxjZHUifQ.zY3GvA4Jq0g5I22NoPCt-Q'; // Set your mapbox token here

// export default function Map(props) {
//   const jobs = props.jobs.jobs
//   console.log(jobs)

//   const [viewport, setViewport] = useState({
//     latitude: 40.730610,
//     longitude: -73.935242,
//     zoom: 7,
//     bearing: 0,
//     pitch: 0
//   });

//   return (
//     <MapGL
//       {...viewport}
//       width="100vw"
//       height="100vh"
//       mapStyle="mapbox://styles/mapbox/dark-v9"
//       onViewportChange={nextViewport => setViewport(nextViewport)}
//       mapboxApiAccessToken={MAPBOX_TOKEN}
//     >
//       {/* <Pins jobs={jobs} /> */}
//       {console.log(jobs)}
//     </ MapGL>
//   );
// }

// ------------------------------------------------------------------------------------------------------------------------------
// Peter's ex-code with hooks, just in case:

// import React, {useState, useEffect} from 'react'
// import ReactMapGL, {Marker, Popup} from 'react-map-gl'

// export default function Map(props) {
//   const jobs = props.jobs.jobs
//   console.log(jobs)

//   const [viewport, setViewport] = useState({
//     latitude: 40.76027,
//     longitude: -73.7178,
//     width: '100vw',
//     height: '100vh',
//     zoom: 10
//   })

//   const [selectedJob, setSelectedJob] = useState(null)

//   useEffect(() => {
//     const listener = e => {
//       if (e.key === 'Escape') {
//         setSelectedJob(null)
//       }
//     }
//     window.addEventListener('keydown', listener)

//     return () => {
//       window.removeEventListener('keydown', listener)
//     }
//   }, [])

//   return (
//     <div className="map">
//       <ReactMapGL
//         {...viewport}
//         mapboxApiAccessToken="pk.eyJ1IjoiYm91c3RhbmlwNzE4IiwiYSI6ImNrZndwa2MweTE1bDkzMHA5NTdvMWxjZHUifQ.zY3GvA4Jq0g5I22NoPCt-Q"
//         mapStyle="mapbox://styles/boustanip718/cki3sq4370yn119qnt5dpkg5v"
//         onViewportChange={nextViewport => setViewport(nextViewport)}
//         // container="map-container"
//       >
//         {jobs &&
//           jobs.map((job, idx) => {
//             return (
//               <Marker
//                 key={idx}
//                 latitude={job.latitude}
//                 longitude={job.longitude}
//               >
//                 <button
//                   type="submit"
//                   className="marker-btn"
//                   onClick={e => {
//                     e.preventDefault()
//                     setSelectedJob(job)
//                   }}
//                 >
//                   <img
//                     src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Map_marker.svg/512px-Map_marker.svg.png"
//                     alt="School Icon"
//                   />
//                 </button>
//               </Marker>
//             )
//           })}
//         {selectedJob && (
//           <Popup
//             latitude={selectedJob.latitude}
//             longitude={selectedJob.longitude}
//             onClose={() => setSelectedJob(null)}
//           >
//             <div className="selectedJob">
//               <h2>{selectedJob.company}</h2>
//               <p>{selectedJob.title}</p>
//               <p>{selectedJob.description}</p>
//               <p>{selectedJob.locationName}</p>
//             </div>
//           </Popup>
//         )}
//       </ReactMapGL>
//     </div>
//   )
// }
