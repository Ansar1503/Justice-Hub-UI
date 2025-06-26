import { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export default function ZegoVideoCall({
  roomID,
  userID,
  userName,
}: {
  roomID: string;
  userID: string;
  userName: string;
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const appID = import.meta.env.VITE_ZEGO_APP_ID;
    const serverSecret = import.meta.env.VITE_ZEGO_SERVERSECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      Number(appID),
      serverSecret,
      roomID,
      userID,
      userName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: containerRef.current,
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
    });
  }, [roomID, userID, userName]);

  return <div ref={containerRef} style={{ width: "100%", height: "600px" }} />;
}
