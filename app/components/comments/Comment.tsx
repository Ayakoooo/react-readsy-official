import { useEffect, useState } from "react";
import type { CommentType } from "~/types/types";
import CommentForm from "./CommentForm";
import type { UseQueryResult } from "@tanstack/react-query";
import { useDisclosure, Button, User, Divider } from "@heroui/react";
import { supabase } from "~/supabase-client";

type Props = {
  comment: CommentType;
  replies: CommentType[];
  className?: string;
  refetchComments?: UseQueryResult["refetch"];
};

export default function Comment({ refetchComments, comment, replies, className = "" }: Props) {
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [canReply, setCanReply] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (isMounted && sessionData.session) setCanReply(true);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted && session) setCanReply(true);
    });

    checkSession();

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);
  return (
    <>
      <div className="py-2 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User
              avatarProps={{
                src: "https://images.unsplash.com/broken",
                showFallback: true,
              }}
              name={comment.username}
              classNames={{ name: "font-medium", description: "text-small" }}
              description={new Intl.DateTimeFormat("pl-PL", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(comment.created_at))}
            />
          </div>
        </div>
        <div className="mt-4 w-full">
          <p className="mt-2 text-default-500">{comment.content}</p>
        </div>
        {comment.parent_id === null && (
          <div className="mt-4">
            <Button onPress={onOpen} variant="ghost" size="sm" disabled={!canReply} className="disabled:cursor-no-drop disabled:opacity-40">
              Odpowiedz
            </Button>
          </div>
        )}
      </div>

      <CommentForm
        postId={comment.post_id}
        submitLabel="Dodaj odpowiedź"
        parentId={comment.id}
        onSubmitCallback={() => {
          refetchComments?.();
          onOpenChange();
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideTrigger
      />

      {replies.length > 0 && (
        <div className="mt-2 ml-10 space-y-4">
          {replies.map((reply) => (
            <>
              <Comment key={reply.id} comment={reply} replies={[]} className="mt-2" refetchComments={refetchComments} />
            </>
          ))}
        </div>
      )}
    </>
  );
}
