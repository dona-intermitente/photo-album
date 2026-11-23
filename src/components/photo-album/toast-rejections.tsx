import { toast } from "sonner";

interface ToastRejectionsProps {
  id: string;
  files: File[];
  message: string;
}

export function ToastRejections({ id, files, message }: ToastRejectionsProps) {
  return {
    id,
    description: (
      <div>
        {files.map((file) => (
          <div key={file.name}>{file.name}</div>
        ))}
        <div>{message}</div>
      </div>
    ),
    action: { label: "Aceptar", onClick: () => toast.dismiss(id) },
    duration: Infinity,
  };
}
