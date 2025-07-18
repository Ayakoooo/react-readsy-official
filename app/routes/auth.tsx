import AuthForm from "~/components/auth/AuthForm";
import type { Route } from "./+types/auth";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Readsy | Rejestracja" }, { name: "description", content: "Rejestracja" }];
}

export default function Auth() {
  return <AuthForm mode="signup" />;
}
