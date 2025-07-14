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
  open: boolean;
  setOpen: (val: boolean) => void;
  handleAction: () => void;
  className?: `${string}`;
  title: string;
  description: string;
  actionText?: string;
};

export default function Confirmation({
  handleAction,
  setOpen,
  open,
  title,
  description,
  className,
  actionText = "Yes, proceed",
}: Props) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No, cancel</AlertDialogCancel>
          <AlertDialogAction
            className={className || ""}
            onClick={() => {
              handleAction();
              setOpen(false);
            }}
          >
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
