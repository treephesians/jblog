"use client";

import { useState } from "react";
import { CommentSection } from "@/components/comment-section";
import { LoginModal } from "@/components/login-modal";
import { useRecordView } from "@/hooks/use-post-interaction";

export function PostInteraction({ slug }: { slug: string }) {
  useRecordView(slug);
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      <CommentSection
        slug={slug}
        onLoginRequired={() => setShowLoginModal(true)}
      />
      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
