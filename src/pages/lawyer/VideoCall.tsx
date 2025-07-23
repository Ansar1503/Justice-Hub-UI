import ZegoVideoCall from "@/components/ZegoCloud";
import { store } from "@/store/redux/store";

export default function VideoCall() {
  const { user } = store.getState().Auth;
  const { AppId, roomId, token } = store.getState().zc;
  //   console.log("user", user);
  //   console.log("id", id);
  
  if (!user || !user.user_id || !AppId || !roomId || !token) return;
  return (
    <div className="h-screen w-screen">
      <ZegoVideoCall
        AppId={AppId}
        token={token}
        userID={user?.user_id}
        roomID={roomId}
        userName={user.name}
      />
    </div>
  );
}
