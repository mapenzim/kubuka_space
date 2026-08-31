import * as AlertDialog from "@radix-ui/react-alert-dialog";
import AdminDialogButton from "@/components/admin/AdminDialogButton";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
};

export default function RemoveItemAlert({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="AlertDialogOverlay" />

        <AlertDialog.Content className="AlertDialogContent dark:bg-gray-900! dark:ring-1! dark:ring-orange-400!">
          <AlertDialog.Title className="AlertDialogTitle dark:text-zinc-300!">
            {title}
          </AlertDialog.Title>

          <AlertDialog.Description className="AlertDialogDescription">
            {description}
          </AlertDialog.Description>

          <div
            style={{
              display: "flex",
              gap: 25,
              justifyContent: "flex-end",
              zIndex: 1000,
            }}
          >
            <AlertDialog.Cancel asChild>
              <AdminDialogButton type="button" variant="secondary">
                {cancelText}
              </AdminDialogButton>
            </AlertDialog.Cancel>

            <AlertDialog.Action asChild>
              <AdminDialogButton
                type="button"
                variant="danger"
                onClick={onConfirm}
              >
                {confirmText}
              </AdminDialogButton>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
