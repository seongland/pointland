import { PVR_URL } from '~/plugins/map/modules/const'
import { GeoJSON } from 'ol/format'

/**
 * Instantiate StPano instance.
 *
 * @param {window} wnd - Document's window object
 * @todo - const to class
 */

const StPano = function(map, targetDomId, onKrpanoCB) {
  console.log('StPano constructor loaded')

  // constant variables
  const origApiServerOrigin = 'localhost:3000/server/'

  // private variables (callbacks)
  this._onArrowClick = null
  this._onYawChange = null
  this._onFovChange = null

  // this._onPoiClick = null;//DBA
  this._onDebugMessage = null
  this._onAvatarMove = null
  this._onKrpanoReady = onKrpanoCB

  // private variables (instances)
  this._krpano = null

  // Status vairalbes
  this.isLogEnabled = true
  this.apiServerOrigin = origApiServerOrigin
  this.currentNodeId = null
  this.features = null

  // action functions
  /**
   * Fetch single traj node data from stryx server
   *
   * @param {int} nodeId - trajnode id
   */
  this.FetchTrajnodeById = function(nodeId) {
    console.log('Fetch Node by id')
    if (this.features == undefined) {
      this.DebugLog('경로 데이터가 없습니다.')
      return -1
    }
    features = this.features
    for (feature of features)
      if (feature.get('pvrid') == nodeId) {
        console.log('', feature)
        return feature
      }
  }

  /**
   * Fetch traj node data from stryx server
   *
   * @param {callback} cbOnFetchFinished - Called when trajnode download is complete
   */
  this.FetchAllTrajNodeData = function(cbOnFetchFinished) {
    this.DebugLog(
      'FetchAllTrajNodeData called. Fetching traj data from stryx server..'
    )
    fetch(PVR_URL, { method: 'GET', mode: 'cors' })
      .then(response => {
        return response.json()
      })
      .then(json => {
        let features = new GeoJSON().readFeatures(json)
        cbOnFetchFinished(features)
      })
  }

  /**
   * Send message to outside of this module, when any event occurs.
   * It is also console output controller for StPano internally.
   * This is for debug purpose.
   *
   * @param {string} strMsg - message to write
   */
  this.DebugLog = function(strMsg) {
    if (this.isLogEnabled) {
      console.log('[StPano]' + strMsg)
      if (null !== this._onDebugMessage) {
        this._onDebugMessage(strMsg)
      }
    }
  }

  /**
   * Set panorama's look angle. It can be called when outside function want to manipulate pano direction.
   *
   * @param {float} angledeg - angle in degree, diverted from initial front direction.
   */
  this.SetHorizontalLookAngle = function(angledeg) {
    this.GetKrpanoInstance().set('view.hlookat', angledeg)
  }

  /**
   * Get panorama's look angle.
   *
   * @param {float} angledeg - angle in degree, diverted from initial front direction.
   */
  this.GetHorizontalLookAngle = function() {
    return this.GetKrpanoInstance().get('view.hlookat')
  }

  /**
   * Set panorama's fov
   *
   * @param {float} fovdeg - angle in degree.
   */
  this.SetFovAngle = function(fovdeg) {
    this.GetKrpanoInstance().set('view.fov', fovdeg)
  }

  /**
   * Get panorama's fov
   *
   * @param {float} angledeg - angle in degree. 0 is min and 180 is max, but maxium and minimum depends on pano's settings.
   */
  this.GetFovAngle = function() {
    return this.GetKrpanoInstance().get('view.fov')
  }

  /**
   * Move pano position
   *
   * @param {json} jsonobj - trajnode instance, formatted
   */
  this.AvatarMove = jsonobj => {
    this.DebugLog('avatar move called - ' + JSON.stringify(jsonobj))
    this.currentNodeId = jsonobj.nodeid
    let xmlDom = ''
    let heading = 0
    let url = this.apiServerOrigin + 'api/pano/tile/' + jsonobj.nodeid
    let tmpStPano = this
    $.ajax({
      url: url,
      type: 'get'
    })
      .done(
        function(data) {
          this.DebugLog('Get all rounds_data Done')
          this.DebugLog(data)
          xmlDom = data
          let s = new XMLSerializer()
          let xmlStr = s.serializeToString(xmlDom)

          // this.DebugLog(xmlStr)
          this.DebugLog(jsonobj)
          let nearNodeUrl =
            this.apiServerOrigin + 'routes/api/nearnode/' + jsonobj.nodeid

          //fetch adjacent trajectory for hostpot displa
          $.ajax({
            crossOrigin: true,
            url: nearNodeUrl,
            type: 'get'
          }).done(
            function(data) {
              this.DebugLog(data)
              var nearNodeList = data
              nearNodeList.forEach(nearNode => {
                let relationTrajnodeId = nearNode.to
                let relationPan = nearNode.pan
                let hotspotAth = 0
                heading = getDrawLayer(map).selected.get('heading')
                hotspotAth = heading + relationPan

                this.GetKrpanoInstance().call(
                  'addhotspot(pois' + relationTrajnodeId + ')'
                )
                this.GetKrpanoInstance().call(
                  'set(hotspot[pois' +
                    relationTrajnodeId +
                    '].url, ' +
                    this.apiServerOrigin +
                    'static/vtourskin_hotspot.png)'
                )
                this.GetKrpanoInstance().call(
                  'set(hotspot[pois' +
                    relationTrajnodeId +
                    '].ath, ' +
                    hotspotAth +
                    ')'
                )
                this.GetKrpanoInstance().call(
                  'set(hotspot[pois' + relationTrajnodeId + '].atv, 20)'
                )
                this.GetKrpanoInstance().call(
                  'set(hotspot[pois' + relationTrajnodeId + '].width, 64)'
                )
                this.GetKrpanoInstance().call(
                  'set(hotspot[pois' + relationTrajnodeId + '].height, 64)'
                )
                this.GetKrpanoInstance().call(
                  'set(hotspot[pois' + relationTrajnodeId + '].distorted, true)'
                )

                this.GetKrpanoInstance().set(
                  'hotspot[pois' + relationTrajnodeId + '].onclick',
                  function(relationTrajnodeId) {
                    this.DebugLog('Heading: ' + hotspotAth)
                    let currentHlookat = this.GetKrpanoInstance().get(
                      'view.hlookat'
                    )
                    let currentVlookat = this.GetKrpanoInstance().get(
                      'view.vlookat'
                    )
                    let relationTrajnode = this.FetchTrajnodeById(
                      relationTrajnodeId
                    )
                    let relationHeading = relationTrajnode.get('heading')

                    // Change Selected
                    changeFeaturebyID(relationTrajnodeId, map)

                    this.AvatarMove({
                      type: 'id',
                      journeyid: 1,
                      nodeid: relationTrajnodeId,
                      hlookat: currentHlookat,
                      vlookat: currentVlookat,
                      heading: relationHeading
                    })
                  }.bind(tmpStPano, relationTrajnodeId)
                )
              })
            }.bind(this)
          )
          this.GetKrpanoInstance().call('loadxml(' + xmlStr + ')')
          if (jsonobj.hlookat) {
            this.GetKrpanoInstance().call(
              'set(view.hlookat, ' + jsonobj.hlookat + ')'
            )
          }
          if (jsonobj.vlookat) {
            this.GetKrpanoInstance().call(
              'set(view.vlookat, ' + jsonobj.vlookat + ')'
            )
          }
          if (this._onAvatarMove !== null) {
            this._onAvatarMove(jsonobj)
          }
        }.bind(this)
      )
      .fail(
        function(data) {
          this.DebugLog('fail')
        }.bind(this)
      )
      .always(function() {})

    // Default Variable
    tmpStPano.fov = 90
    tmpStPano.yaw = 0
  }
  /**
   * krpano instance getter
   */
  this.GetKrpanoInstance = () => {
    return this._krpano
  }
  /**
   * Clear saved POIs in viewer
   *
   * @param {callback} cbOnClearFinished - called after POI clearing is done
   */
  this.ClearPOIs = function(cbOnClearFinished) {
    this.DebugLog('ClearPOIs called')
    //do some POI clear works here
    cbOnClearFinished()
  }

  /**
   * Add POI to viewer
   *
   * @param {list} jsonobjlist - poi informations to add to viewer
   */
  this.AddPOIs = function(jsonobj) {
    this.DebugLog('AddPOIs called with object - ' + JSON.stringify(jsonobj))
    let idxObj = 0
    let poilist = jsonobj.pois
    for (idxObj = 0; idxObj < poilist.length; idxObj++) {
      let poiobj = poilist[idxObj]
      this.DebugLog('poiobj - ' + JSON.stringify(poiobj))
      // add jsonobj to krpano
    }
  }

  // Getters and Setters
  /**
   * @param {callback} cbOnArrowClicked - callback function when arrow is clicked
   */
  this.SetArrowClickCallback = function(cbOnArrowClicked) {
    this.DebugLog('New callback registered - SetArrowClickCallback')
    this._onArrowClick = cbOnArrowClicked
  }

  /**
   * @param {callback} cbOnDebugMessage - callback function when any event occurs inside this module
   */
  this.SetDebugMessageCallback = function(cbOnDebugMessage) {
    this.DebugLog('New callback registered - SetDebugMessageCallback')
    this._onDebugMessage = cbOnDebugMessage
  }

  /**
   * @param {callback} cbOnFovChange - callback function when fov changes
   */
  this.SetFovChangeCallback = function(cbOnFovChange) {
    this.DebugLog('New callback registered - SetOnFovChangeCallback')
    this.DebugLog('SetFovChangeCallback called')
    this._onFovChange = cbOnFovChange
  }

  /**
   * @param {callback} cbOnYawChange - callback function when yaw changes
   */
  this.SetYawChangeCallback = function(cbOnYawChange) {
    this.DebugLog('New callback registered - SetOnYawChangeCallback')
    this.DebugLog('SetYawChangeCallback called')
    this._onYawChange = cbOnYawChange
  }

  /**
   * @param {callback} cbOnYawChange - callback function when yaw changes
   */
  this.SetAvatarMoveCallback = function(cbOnAvatarMove) {
    this.DebugLog('New callback registered - SetAvatarMoveCallback')
    this._onAvatarMove = cbOnAvatarMove
  }

  // internal function
  var onKrpanoReadyFirstCallback = function(krpano_instance) {
    //save instance
    this._krpano = krpano_instance

    //add krpano events
    if (this.GetKrpanoInstance()) {
      this.GetKrpanoInstance().set(
        'events.onmouseup',
        function() {
          var tempt = this.GetKrpanoInstance().get('view.hlookat')
          if (tempt < 0) tempt += 360 * 100
          tempt %= 360
          Yawval = Math.abs(tempt.toFixed(2))
          //var Yawval = krpano.get("view.hlookat");
          this._onYawChange(Yawval)
        }.bind(this)
      )

      this.GetKrpanoInstance().set(
        'events.onmousewheel',
        function() {
          var tempt = this.GetKrpanoInstance().get('view.fov')
          let fovval = tempt

          this._onFovChange(fovval)
        }.bind(this)
      )
    }

    //user callback is called here
    this._onKrpanoReady(krpano_instance)
  }.bind(this)

  // init krpano instance
  embedpano({
    xml: null,
    target: targetDomId,
    html5: 'auto',
    onready: onKrpanoReadyFirstCallback
  })
}

export { StPano }
