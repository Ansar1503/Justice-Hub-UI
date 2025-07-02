import ZegoVideoCall from "@/components/ZegoCloud";
import { store } from "@/store/redux/store";
import { useParams } from "react-router-dom";

export default function VideoCall() {
  const { user } = store.getState().Auth;
  const { id } = useParams();
//   console.log("user", user);
//   console.log("id", id);
  if (!user || !user.user_id || !id) return;
  return (
    <div className="h-screen w-screen">
      <ZegoVideoCall userID={user?.user_id} roomID={id} userName={user.name} />
    </div>
  );
}
