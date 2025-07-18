import { useQuery } from "@tanstack/react-query";
import { supabase } from "~/supabase-client";
import type { CommentType, FairyTaleType } from "~/types/types";
import { Badge, Button, Divider, ScrollShadow, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import CommentForm from "../comments/CommentForm";
import CommentsList from "../comments/CommentsList";

type Props = {
  postData: FairyTaleType;
};

export default function FairyTale({ postData }: Props) {
  const {
    data: comments,
    refetch,
    isLoading,
  } = useQuery<CommentType[]>({
    queryKey: ["comments", postData.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("comments").select("*").eq("post_id", postData.id).order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 15,
  });
  const commentsSectionRef = useRef<HTMLElement | null>(null);
  const publicUrl = supabase.storage.from("banners").getPublicUrl(postData.image_url || "").data.publicUrl;
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    check();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  const user = session?.user;

  const [fakeFav, setFakeFav] = useState<boolean>(false);

  const addToFavorites = async () => {
    const { error } = await supabase.from("user_favorites").insert({
      user_id: user?.id,
      fairy_tale_id: postData.id,
    });

    if (error) {
      alert(error.message);
    }
  };

  return isLoading ? (
    <main className="min-h-screen grid place-content-center">
      <Spinner size="lg" />
    </main>
  ) : (
    <main className="relative">
      <article className="space-y-2 w-full mx-auto max-w-4xl p-4 md:p-2">
        <header className="flex flex-col mb-8 items-center">
          <p className="text-tiny">
            {new Intl.DateTimeFormat("pl-PL", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }).format(new Date(postData.created_at))}
          </p>
          <h1 className="font-bold text-2xl md:text-4xl">{postData.title}</h1>
          {/* <div className="flex items-center gap-4 self-end">
            <p className="text-foreground-600">Piotr Księżyk</p>
            <Tooltip content={`${fakeFav ? "Usuń bajkę z ulubionych" : "Dodaj do ulubionych"}`} showArrow={true}>
              <Button
                isIconOnly
                variant={fakeFav ? "solid" : "bordered"}
                className="self-end"
                onPress={() => {
                  setFakeFav(!fakeFav);
                  addToast({
                    title: `${!fakeFav ? "Dodano bajke do ulubionych" : "Usunięto bajke z ulubionych"}`,
                    timeout: 3000,
                    shouldShowTimeoutProgress: true,
                    color: `${!fakeFav ? "success" : "danger"}`,
                    variant: "flat",
                  });
                }}
              >
                {fakeFav ? <Icon icon={"system-uicons:heart-remove"} width={21} height={21} /> : <Icon icon={"system-uicons:heart"} width={21} height={21} />}
              </Button>
            </Tooltip>
          </div> */}
        </header>
        <ScrollShadow className="relative h-[500px]">
          <pre className="font-sans whitespace-pre-wrap break-words w-full">{postData.brief}</pre>
          <pre className="font-sans whitespace-pre-wrap break-words w-full">{postData.content}</pre>
          <Button
            isIconOnly
            className="md:hidden fixed bottom-6 z-20 left-1/2 -translate-x-1/2"
            onPress={() => {
              commentsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Icon icon="system-uicons:chat-add" width={24} height={24} />
          </Button>
        </ScrollShadow>
      </article>
      {/* <section className="p-4 max-w-6xl  mx-auto flex justify-center items-center">
        <Card isFooterBlurred className="border-none max-w-4xl w-full h-[60vh]" radius="sm">
          <div className="w-full h-full bg-no-repeat bg-cover bg-top" style={{ backgroundImage: `url(${publicUrl})` }} />
          <CardFooter className="justify-between before:bg-white/10 border-white/20 overflow-hidden py-1 md:py-4 absolute before:rounded-xl  bottom-0  shadow-small  z-10">
            <h1 className="text-sm md:text-lg  text-white/80">{postData.title}</h1>
            <Button startContent={<Icon icon={"system-uicons:heart"} width={18} height={18} />} className="text-tiny text-white " color="primary" radius="lg" size="sm" variant="flat" onPress={addToFavorites}>
              <span className="hidden md:flex">Dodaj do ulubionych</span>
            </Button>
          </CardFooter>
        </Card>
      </section> */}
      <section className="max-w-4xl mx-auto mt-8 mb-4 px-4 md:px-0" ref={commentsSectionRef}>
        <div className="flex items-center justify-between ">
          <CommentForm submitLabel="Dodaj komentarz" postId={postData.id} onSubmitCallback={() => refetch?.()} />
          <div className="inline-flex gap-2 items-center">
            <Badge size="md" className="text-tiny" color="default" content={comments?.length} shape="circle">
              <Icon width={24} height={24} icon="system-uicons:message" />
            </Badge>
          </div>
        </div>
        <Divider className="my-4 " />
      </section>
      <CommentsList postId={postData.id} comments={comments} refetch={refetch} />
      {/* <div className="bg-no-repeat bg-cover bg-center sm:w-[260px] min-h-[80vh] sm:fixed bg-black top-[55%] -translate-y-1/2 left-4" style={{ backgroundImage: `url("/pink.webp")` }} />
      <div className="bg-no-repeat bg-cover bg-top sm:w-[260px] min-h-[80vh] sm:fixed bg-black top-[55%] -translate-y-1/2 right-4" style={{ backgroundImage: `url("/squirt.webp")` }} /> */}
    </main>
  );
}
