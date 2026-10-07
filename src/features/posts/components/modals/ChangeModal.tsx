"use client";

import PostModal from "./PostModal";

export default function ChangeModal(props: {
  open: boolean;
  initialValue: string;
  busy?: boolean;
  onClose: () => void;
  onSubmit: (description: string) => void;
}) {
  return <PostModal {...props} title="Ubah cerita" />;
}
