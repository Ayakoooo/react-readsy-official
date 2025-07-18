import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Textarea, Divider } from "@heroui/react";
import { useState } from "react";
import { Link } from "react-router";
import { useUser } from "~/helpers/useUser";
import { supabase } from "~/supabase-client";
import { Icon } from "@iconify/react";

type Props = {
  postId: number;
  submitLabel: string;
  parentId?: number | null;
  onSubmitCallback?: () => void;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  hideTrigger?: boolean;
};

export default function CommentForm({
  onSubmitCallback,
  submitLabel,
  postId,
  parentId = null,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange,
  hideTrigger = false,
}: Props & {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}) {
  const { data: user } = useUser();
  const [content, setContent] = useState("");

  const fallbackDisclosure = useDisclosure();
  const isOpen = controlledIsOpen ?? fallbackDisclosure.isOpen;
  const onOpenChange = controlledOnOpenChange ?? fallbackDisclosure.onOpenChange;
  const onOpen = fallbackDisclosure.onOpen;

  const isLoggedIn = !!user;

  const handleSubmit = async () => {
    if (!user || content.trim().length === 0) return;

    await supabase.from("comments").insert({
      post_id: postId,
      user_id: user.id,
      parent_id: parentId,
      username: user.user_metadata.displayName,
      content,
    });

    setContent("");
    onSubmitCallback?.();
  };

  if (!isLoggedIn && !hideTrigger) return <Link to="/logowanie">Zaloguj się aby dodać komentarz</Link>;

  return (
    <>
      {!hideTrigger && (
        <Button size="sm" onPress={onOpen} startContent={<Icon icon="system-uicons:chat-add" width={18} height={18} />} className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-offset-1">
          Dodaj komentarz
        </Button>
      )}

      <Modal backdrop="opaque" isOpen={isOpen} onOpenChange={onOpenChange} size="xl" placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">
                <p>Dodaj swój komentarz</p>
                <p className="text-tiny text-center font-medium">Podziel się swoją opinią o tej bajce. Pisz z szacunkiem, unikaj obraźliwych słów i pamiętaj, że Twoje zdanie może przeczytać każdy. Staraj się być uprzejmy i konstruktywny.</p>
              </ModalHeader>
              <ModalBody>
                <Textarea autoFocus onChange={(e) => setContent(e.target.value)} minRows={8} isClearable isRequired className="w-full" label="Komentarz" labelPlacement="inside" placeholder="Napisz, co myślisz o tej bajce..." />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose} className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-offset-1">
                  Anuluj
                </Button>
                <Button
                  color="primary"
                  onPress={async () => {
                    await handleSubmit();
                    onClose();
                  }}
                  isDisabled={content.trim().length === 0}
                  className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
                >
                  Opublikuj komentarz
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
