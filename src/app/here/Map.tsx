'use client'
import React, { useCallback, useEffect, useRef } from 'react'
import H from '@here/maps-api-for-javascript'

const waypoints = [
  {
    lat: -20.2526,
    lng: -40.384742,
  },
  {
    lat: -20.2867824,
    lng: -40.3924027,
  },
  {
    lat: -20.3381388,
    lng: -40.3996667,
  },
  {
    lat: -20.3392485,
    lng: -40.3944441,
  },
  {
    lat: -20.3360519,
    lng: -40.3974295,
  },
  {
    lat: -20.3441548,
    lng: -40.3947453,
  },
  {
    lat: -20.3441548,
    lng: -40.3947453,
  },
  {
    lat: -20.3445122,
    lng: -40.3937151,
  },
  {
    lat: -20.34072102,
    lng: -40.39168754,
  },
  {
    lat: -20.3421365,
    lng: -40.3905599,
  },
  {
    lat: -20.3440038,
    lng: -40.388236,
  },
  {
    lat: -20.3461178,
    lng: -40.3821877,
  },
  {
    lat: -20.341574,
    lng: -40.3896107,
  },
  {
    lat: -20.3422764,
    lng: -40.3853855,
  },
  {
    lat: -20.34034326,
    lng: -40.38388335,
  },
  {
    lat: -20.3425342,
    lng: -40.3785525,
  },
  {
    lat: -20.3497363,
    lng: -40.3827485,
  },
  {
    lat: -20.3514792,
    lng: -40.3846566,
  },
  {
    lat: -20.3415623,
    lng: -40.3749309,
  },
  {
    lat: -20.3548036,
    lng: -40.379495,
  },
  {
    lat: -20.3559821,
    lng: -40.391243,
  },
  {
    lat: -20.3624518,
    lng: -40.3720421,
  },
  {
    lat: -20.3581501,
    lng: -40.3662544,
  },
  {
    lat: -20.3733405,
    lng: -40.3739903,
  },
  {
    lat: -20.347866,
    lng: -40.4065134,
  },
  {
    lat: -20.3507319,
    lng: -40.4062108,
  },
  {
    lat: -20.3270849,
    lng: -40.3623295,
  },
  {
    lat: -20.3310052,
    lng: -40.3631857,
  },
  {
    lat: -20.3359985,
    lng: -40.358506,
  },
  {
    lat: -20.3338094,
    lng: -40.3642114,
  },
  {
    lat: -20.3358465,
    lng: -40.3662661,
  },
  {
    lat: -20.3043637,
    lng: -40.3651189,
  },
  {
    lat: -20.3043614,
    lng: -40.3655267,
  },
  {
    lat: -20.3264598,
    lng: -40.3838328,
  },
  {
    lat: -20.3082314,
    lng: -40.3919067,
  },
  {
    lat: -20.3060392,
    lng: -40.391222,
  },
  {
    lat: -20.3347319,
    lng: -40.4020669,
  },
  {
    lat: -20.3379365,
    lng: -40.4043323,
  },
  {
    lat: -20.26768006,
    lng: -40.42816096,
  },
]

type Location = { lat: number; lng: number }

type Props = {
  apiKey: string
  userPosition: Location
  restaurantPosition?: Location
}

const Map = (props: Props) => {
  const { apiKey, userPosition, restaurantPosition } = props
  const mapRef = useRef(null)
  const map = useRef<H.Map>()
  const platform = useRef<H.service.Platform>()

  const getMarkerIcon = useCallback((color: string) => {
    const svgCircle = `<svg width="20" height="20" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g id="marker">
                <circle cx="10" cy="10" r="7" fill="${color}" stroke="${color}" stroke-width="4" />
                </g></svg>`
    return new H.map.Icon(svgCircle, {
      anchor: {
        x: 10,
        y: 10,
      },
    })
  }, [])

  const calculateRoute = useCallback(
    (
      platform: H.service.Platform,
      map: H.Map,
      start: Location,
      destination: Location,
    ) => {
      function routeResponseHandler(response: any) {
        const sections = response.routes[0].sections as any[]
        const lineStrings: H.geo.LineString[] = []

        sections.forEach((section) => {
          // convert Flexible Polyline encoded string to geometry
          lineStrings.push(
            H.geo.LineString.fromFlexiblePolyline(section.polyline),
          )
        })
        const multiLineString = new H.geo.MultiLineString(lineStrings)
        const bounds = multiLineString.getBoundingBox()

        const routeBackground = new H.map.Polyline(multiLineString, {
          style: {
            lineWidth: 5,
            strokeColor: 'rgba(0, 0, 0, 0.7)',
            lineTailCap: 'arrow-tail',
            lineHeadCap: 'arrow-head',
          },
          data: null, // Add the missing 'data' property
        })
        // Create a patterned polyline:
        const routeArrows = new H.map.Polyline(multiLineString, {
          style: {
            lineWidth: 5,
            fillColor: 'white',
            strokeColor: 'rgba(255, 255, 255, 1)',
            lineDash: [0, 2],
            lineTailCap: 'arrow-tail',
            lineHeadCap: 'arrow-head',
          },
          data: null, // Add the missing 'data' property
        })
        // Create a group that represents the route line and contains
        // Outline and the pattern
        var routeLine = new H.map.Group()
        routeLine.addObjects([routeBackground, routeArrows])

        // Remove all the previous map objects, if any
        map.removeObjects(map.getObjects())
        // Add the polyline to the map
        map.addObject(routeLine)
        map.addObjects([
          // Add a marker for the user
          new H.map.Marker(start, {
            icon: getMarkerIcon('red'),
            data: null, // Add the missing 'data' property
          }),
          // Add a marker for the selected restaurant
          new H.map.Marker(destination, {
            icon: getMarkerIcon('green'),
            data: null, // Add the missing 'data' property
          }),
        ])

        const markerArray = waypoints.map(
          (wp) =>
            new H.map.Marker(wp, {
              icon: getMarkerIcon('blue'),
              max: 20,
              min: 10,
              data: null, // Add the missing 'data' property
            }),
        )

        map.addObjects(markerArray)
      }

      // Get an instance of the H.service.RoutingService8 service
      const router = platform.getRoutingService(undefined, 8)

      // Define the routing service parameters
      const routingParams = {
        origin: `${start.lat},${start.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        transportMode: 'car',
        return: 'polyline',
        via: new H.service.Url.MultiValueQueryParameter(
          waypoints.map((wp) => `${wp.lat},${wp.lng}`),
        ),
      }
      // Call the routing service with the defined parameters
      router.calculateRoute(routingParams, routeResponseHandler, console.error)
    },
    [getMarkerIcon],
  )

  useEffect(
    () => {
      // Check if the map object has already been created
      if (!map.current) {
        // Create a platform object with the API key
        platform.current = new H.service.Platform({ apikey: apiKey })
        // Create a new Raster Tile service instance
        const rasterTileService = platform.current.getRasterTileService({
          queryParams: {
            style: 'explore.day',
            size: 512,
          },
        })
        // Creates a new instance of the H.service.rasterTile.Provider class
        // The class provides raster tiles for a given tile layer ID and pixel format
        const rasterTileProvider = new H.service.rasterTile.Provider(
          rasterTileService,
        )
        // Create a new Tile layer with the Raster Tile provider
        const rasterTileLayer = new H.map.layer.TileLayer(rasterTileProvider)
        // Create a new map instance with the Tile layer, center and zoom level
        const newMap = new H.Map(mapRef.current!, rasterTileLayer, {
          pixelRatio: window.devicePixelRatio,
          center: userPosition,
          zoom: 14,
        })

        // Add panning and zooming behavior to the map
        const behavior = new H.mapevents.Behavior(
          new H.mapevents.MapEvents(newMap),
        )

        // Set the map object to the reference
        map.current = newMap
      }

      if (restaurantPosition) {
        calculateRoute(
          platform.current!,
          map.current,
          userPosition,
          restaurantPosition,
        )
      }
    },
    // Dependencies array
    [apiKey, userPosition, restaurantPosition, calculateRoute],
  )

  // Return a div element to hold the map
  return (
    <div
      className="w-full h-[90vh]"
      ref={mapRef}
    />
  )
}

export default Map
