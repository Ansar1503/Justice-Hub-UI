import { NotificationType } from "@/types/types/Notification";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
type Props = {
  notifcation: NotificationType;
  open: boolean;
  setOpen: (val: boolean) => void;
  handleAction: () => void;
};

export default function SessionNotificationAlert({
  handleAction,
  setOpen,
  open,
  notifcation,
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{notifcation.title}</AlertDialogTitle>
          <AlertDialogDescription>{notifcation.message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No, cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              handleAction();
              setOpen(false);
            }}
          >
            Join Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
