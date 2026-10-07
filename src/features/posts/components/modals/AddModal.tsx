"use client";

import PostModal from "./PostModal";

export default function AddModal(props: {
  open: boolean;
  busy?: boolean;
  onClose: () => void;
  onSubmit: (description: string) => void;
}) {
  return <PostModal {...props} title="Tulis cerita baru" />;
}
