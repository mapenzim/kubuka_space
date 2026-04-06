import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { ReactNode } from "react";

type ConfirmDialogProps = {
  trigger: ReactNode;              // The button or element that opens the dialog
  title: string;                   // Dialog title
  description?: string;            // Optional description
  confirmText?: string;            // Text for confirm button
  cancelText?: string;             // Text for cancel button
  onConfirm: () => void | Promise<void>; // Action when confirmed
};

const RemoveAlert = ({
  trigger,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
}: ConfirmDialogProps) => (
	<AlertDialog.Root>
		<AlertDialog.Trigger asChild>
			{trigger}
		</AlertDialog.Trigger>
		<AlertDialog.Portal>
			<AlertDialog.Overlay className="AlertDialogOverlay" />
			<AlertDialog.Content className="AlertDialogContent">
				<AlertDialog.Title className="AlertDialogTitle">
					{title}
				</AlertDialog.Title>
				<AlertDialog.Description className="AlertDialogDescription">
					{description}
				</AlertDialog.Description>
				<div style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}>
					<AlertDialog.Cancel asChild>
						<button 
              className="Button mauve"
            >
							{cancelText}
						</button>
					</AlertDialog.Cancel>
					<AlertDialog.Action asChild>
						<button 
              className="Button red"
              onClick={onConfirm}
            >
							{confirmText}
						</button>
					</AlertDialog.Action>
				</div>
			</AlertDialog.Content>
		</AlertDialog.Portal>
	</AlertDialog.Root>
);

export default RemoveAlert;
