import { Link as HeroUILink, Card, CardHeader, Button, Image, Divider, Chip, LinkIcon, linkAnchorClasses } from "@heroui/react";
import { Link } from "react-router";

type Props = {
  title: string;
  brief: string;
  imageSrc: string;
  url: string;
  createdAt: string;
};

export default function FairyTalePost({ title, brief, imageSrc, url, createdAt }: Props) {
  return (
    <div>
      <Card radius="none" shadow="md">
        <CardHeader className="absolute z-10 top-1 flex-col gap-2 justify-center items-center">
          <p className="text-tiny text-white/60 uppercase font-bold">{url}</p>
        </CardHeader>
        <Image radius="none" removeWrapper src={imageSrc || "/auth.bg-landscape-bg.png"} className="z-0 w-full max-h-[500px] aspect-video object-cover object-top" fallbackSrc="/recents-placeholder.png" />
      </Card>
      <article className="space-y-4 py-4 md:py-6">
        <Link to={`/bajki/${url}`} className="block max-w-[26ch] w-full truncate md:py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-offset-1 !text-foreground font-medium font-serif text-xl md:text-5xl ">
          {title}
        </Link>

        <p className=" text-gray-400 text-tiny md:text-md">{brief}</p>
        <div className="flex justify-between items-center ">
          <Chip size="sm" radius="sm">
            {new Date(createdAt).toLocaleDateString("pl-PL")}
          </Chip>
          <Button isIconOnly color="default" variant="ghost" size="sm" className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-offset-1" as={Link} to={`/bajki/${url}`}>
            <LinkIcon />
          </Button>
        </div>
      </article>
      <Divider className="my-4" />
    </div>
  );
}
