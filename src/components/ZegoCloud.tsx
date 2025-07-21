import { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
// import { useNavigate } from "react-router-dom";

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
  const zegoInstanceRef = useRef<any>(null);
  // const navigate = useNavigate();
  useEffect(() => {
    const appID = import.meta.env.VITE_ZEGO_APP_ID;
    const serverSecret = import.meta.env.VITE_ZEGO_SERVERSECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
      Number(appID),
      serverSecret,
      roomID,
      userID,
      userName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zegoInstanceRef.current = zp;

    zp.joinRoom({
      container: containerRef.current,
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
      showScreenSharingButton: false,
    });

    return () => {
      if (zegoInstanceRef.current) {
        zegoInstanceRef.current.destroy();
        zegoInstanceRef.current = null;
      }
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => stream.getTracks().forEach((track) => track.stop()))
        .catch((err) => console.log("errpr", err));
    };
  }, [roomID, userID, userName]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        backgroundColor: "black",
      }}
    />
  );
}
