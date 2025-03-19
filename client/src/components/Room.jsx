// To enter the main room chat page

import React from 'react'
import {useParams} from 'react-router-dom'
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt'

const Room = () => {
  const {roomId} = useParams()

  const myMeeting = async(element) => {
    const appId = 1904747946
    const serverSecret = import.meta.env.VITE_ZEGOCLOUD_SERVER_SECRET
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appId, serverSecret, roomId, Date.now().toString(), 'Madhushri')
    const zp = ZegoUIKitPrebuilt.create(kitToken)
    zp.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference
      }
    })
  }
  
  return (
    <div>
      <div ref={myMeeting} />
    </div>
  )
}

export default Room