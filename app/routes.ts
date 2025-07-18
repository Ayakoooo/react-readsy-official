import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"), route("/rejestracja", "routes/auth.tsx"), route("logowanie", "routes/login.tsx"), route("/bajki/:url", "routes/tales.tsx")] satisfies RouteConfig;
