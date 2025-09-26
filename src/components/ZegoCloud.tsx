import { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
// import { useEndSession } from "@/store/tanstack/mutations/sessionMutation";

export default function ZegoVideoCall({
  // sessionId,
  roomID,
  userID,
  userName,
  token,
  AppId,
}: {
  sessionId: string;
  AppId: number;
  roomID: string;
  userID: string;
  userName: string;
  token: string;
}) {
  // console.log("zegocloud");
  // const { mutateAsync: endSessionMutate } = useEndSession();
  const containerRef = useRef(null);
  const zegoInstanceRef = useRef<any>(null);
  // const navigate = useNavigate();
  useEffect(() => {
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
      AppId,
      token,
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
      branding: {
        logoURL:
          "https://github.com/Ansar1503/Justice-Hub-UI/blob/f01588155564983e6ebf86e95e70579ca5dee29b/src/assets/07-03.jpg",
      },
      onLeaveRoom() {
        handleLeaveRoom();
      },
    });
    async function handleLeaveRoom() {}
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
