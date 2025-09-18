import axiosinstance from "@/utils/api/axios/axios.instance";
import { useEffect, useState } from "react";

export function useProfileBlobImage({
  profileImage,
}: {
  profileImage: string | undefined;
}) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!profileImage) return;

    (async () => {
      try {
        const result = await axiosinstance.get(profileImage, {
          responseType: "blob",
          withCredentials: false,
        });

        const url = URL.createObjectURL(result.data);
        setBlobUrl(url);

        // cleanup
        return () => URL.revokeObjectURL(url);
      } catch (error) {
        console.log("image fetch error", error);
      }
    })();
  }, [profileImage]);
  return { blobUrl };
}
