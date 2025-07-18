import Recents from "~/pages/recents/recents";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Readsy" }, { name: "description", content: "Welcome to React Router!" }];
}

export default function Home() {
  return <Recents />;
}
