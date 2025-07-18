import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "~/supabase-client";
import type { CommentType } from "~/types/types";
import Comment from "./Comment";
import { Divider } from "@heroui/react";

type Props = {
  postId: number;
  comments?: CommentType[];
  refetch?: UseQueryResult["refetch"];
};

export default function CommentsList({ postId, comments, refetch }: Props) {
  const rootComments = comments?.filter((comment) => comment.parent_id === null) || [];
  const getReplies = (commentId: number) => {
    return comments?.filter((comment) => comment.parent_id === commentId) || [];
  };

  return (
    <section className="max-w-4xl mx-auto space-y-6 px-4 md:px-0 py-4">
      {rootComments.map((comment) => (
        <Comment key={comment.id} comment={comment} replies={getReplies(comment.id)} refetchComments={refetch} />
      ))}
    </section>
  );
}
