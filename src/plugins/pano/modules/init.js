import { StPano } from '~/plugins/pano/modules/model'
import { changeArc } from '~/plugins/map/event'

function krpano_onready_callback(krpano_instance) {
  console.log('KrPano inside StPano is ready')
}

function stPanoInit(map) {
  let textEventFromPano = {}
  textEventFromPano.value = ''
  let tmpStpano = new StPano(map, 'pano', krpano_onready_callback)

  // system
  tmpStpano.SetDebugMessageCallback(strmsg => {
    textEventFromPano.value = strmsg + '\n' + textEventFromPano.value
  })

  //set callbacks
  tmpStpano.SetArrowClickCallback(index => {
    console.log('arrow clicked')
    console.log('index : ' + index)
  })

  tmpStpano.SetFovChangeCallback(fovdeg => {
    console.log('fov changed ' + fovdeg)
    tmpStpano.fov = fovdeg
    let currentJsonobj = tmpStpano.FetchTrajnodeById(tmpStpano.currentNodeId)
    let angle = tmpStpano.yaw - Number(currentJsonobj.get('heading'))
    changeArc(angle, tmpStpano.GetFovAngle(), map)
  })

  // Pano Moveend Event Function
  tmpStpano.SetYawChangeCallback(yawdeg => {
    tmpStpano.yaw = yawdeg
    if (tmpStpano.currentNodeId) {
      let currentJsonobj = tmpStpano.FetchTrajnodeById(tmpStpano.currentNodeId)
      let angle = Number(yawdeg) - Number(currentJsonobj.get('heading'))
      changeArc(angle, tmpStpano.GetFovAngle(), map)
    }
  })

  // Fetch data
  tmpStpano.FetchAllTrajNodeData(function(features) {
    console.log('(simulated) node fetched from server')
    tmpStpano.features = features
    // @todo - add to table by vuex
  })

  tmpStpano.ClearPOIs(() => {
    console.log('All pois cleared')
    tmpStpano.AddPOIs({
      pois: [
        {
          coordtype: 'wgs84',
          x: 38.2,
          y: 144.2,
          height: 44,
          icontype: 'circle',
          icontext: 'Restroom 14'
        },
        {
          coordtype: 'wgs84',
          x: 38.2,
          y: 144.2,
          height: 44,
          icontype: 'sportsicon',
          icontext: 'SoccerBox 7'
        }
      ]
    })
    console.log('All pois added')
  })

  tmpStpano.SetAvatarMoveCallback(jsonobj => {
    console.log('When avatar is moved by pano event, like hotspot click,')
    console.log('this function is called. soo...')
    let currentNodeJsonobj = tmpStpano.FetchTrajnodeById(jsonobj.nodeid)
    let markerHeading = currentNodeJsonobj.get('heading')
    if (jsonobj.hlookat) markerHeading += jsonobj.hlookat
    console.log('markerHeading: ', markerHeading)
  })
  return tmpStpano
}

export { stPanoInit }
