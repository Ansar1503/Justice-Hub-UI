import ZegoVideoCall from "@/components/ZegoCloud";
import { store } from "@/store/redux/store";
import { useParams } from "react-router-dom";

export default function VideoCall() {
  const { user } = store.getState().Auth;
  const { AppId, roomId, token } = store.getState().zc;
  //   console.log("user", user);
  //   console.log("id", id);
  const { id } = useParams();
  // console.log("id", id);
  // console.log("appId", AppId);
  // console.log("roomId", roomId);
  // console.log("token", token);
  if (!user || !user.user_id || !AppId || !roomId || !token || !id) return;
  return (
    <div className="h-screen w-screen">
      <ZegoVideoCall
        sessionId={id}
        AppId={AppId}
        token={token}
        userID={user?.user_id}
        roomID={roomId}
        userName={user.name}
      />
    </div>
  );
}
