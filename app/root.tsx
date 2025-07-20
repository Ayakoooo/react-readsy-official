import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { HeroUIProvider, Switch } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppNavbar from "./components/shared/Navbar";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const queryClient = new QueryClient();

export default function App() {
  // Dark Mode Setup
  const [isDark, setIsDark] = useState<boolean>(false);

  // Switch Dark Mode
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("dark", isDark);
  }, [isDark]);

  // Save Dark Mode status
  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Initialize Theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    setIsDark(saved === "dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider>
        <AppNavbar />
        <Outlet />
        <Switch onValueChange={setIsDark} isSelected={isDark} className="fixed bottom-1 right-1 md:bottom-2 md:right-2 z-40" defaultSelected color="default" size="sm" thumbIcon={({ isSelected, className }) => (isSelected ? <Icon icon="system-uicons:sun" className={className} /> : <Icon icon="system-uicons:moon" className={className} />)}></Switch>
      </HeroUIProvider>
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
