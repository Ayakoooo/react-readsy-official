import AuthForm from "~/components/auth/AuthForm";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Readsy | Logowanie" }, { name: "description", content: "logowanie" }];
}

export default function Login() {
  return <AuthForm mode="login" />;
}
