import { Link as HeroUILink, Form, Input, Button, Divider, Card, Image, CardFooter } from "@heroui/react";
import { Link } from "react-router";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { supabase } from "~/supabase-client";

type Props = { mode: "signup" | "login" };

export default function AuthForm({ mode = "signup" }: Props) {
  // General states
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [redirect, setRedirect] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  // Signup states
  const signInWithApple = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "apple",
    });
  };
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { displayName: username },
      },
    });

    setLoading(false);
    setEmail("");
    setUsername("");
    setPassword("");

    if (!data) setMessage("Błąd rejestracji: " + (error?.message || "Nieznany błąd"));
  };

  // Login states
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("Wystąpił błąd: " + error.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (isMounted && sessionData.session) setRedirect(true);
      if (isMounted) setAuthChecked(true);
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted && session) setRedirect(true);
    });

    checkSession();

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // Redirects
  if (!authChecked) return null;
  if (redirect) return <Navigate to="/" />;

  return (
    <main className="h-screen relative flex flex-col md:flex-row items-stretch gap-4 p-4 md:p-3 ">
      <div className="absolute inset-0 bg-repeat" />

      <div className="relative flex-1  flex items-start justify-center px-2 md:px-0 pt-6 md:pt-0">
        <div className="flex w-full max-w-md  flex-col gap-4 rounded-large bg-content1 px-6 sm:px-8 pb-8 pt-6 shadow-small">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-large font-medium">{mode === "signup" ? "Zajerestruj się" : "Zaloguj się"}</h1>
            <p className="text-xs md:text-small text-default-500">{mode === "signup" ? "aby dołączyć do świata baśni" : "aby kontynuować swoją bajkową podróż"}</p>
          </div>

          <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={mode === "signup" ? handleRegister : handleLogin}>
            <Input value={email} isRequired label="Email" name="email" placeholder="Wpisz swój email" type="email" variant="bordered" autoFocus onChange={(e) => setEmail(e.target.value)} />
            {mode === "signup" && <Input value={username} isRequired label="Nazwa użytkownika" name="username" placeholder="Podaj nazwę" type="text" variant="bordered" onChange={(e) => setUsername(e.target.value)} />}
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
              label="Hasło"
              name="password"
              placeholder="Wpisz hasło"
              type={isVisible ? "text" : "password"}
              variant="bordered"
              endContent={
                <button tabIndex={-1} type="button" onClick={() => setIsVisible(!isVisible)}>
                  <Icon icon={isVisible ? "solar:eye-closed-linear" : "solar:eye-bold"} className="pointer-events-none text-2xl text-default-400" />
                </button>
              }
            />

            <Button className="w-full focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-offset-1" color="primary" type="submit" disabled={loading}>
              {mode === "signup" ? "Zajerestruj się" : "Zaloguj się"}
            </Button>
          </Form>

          {message && <p className="text-xs md:text-small text-center text-warning">{message}</p>}

          <div className="flex items-center gap-4 py-2">
            <Divider className="flex-1" />
            <p className="shrink-0 text-xs md:text-tiny text-default-500">LUB</p>
            <Divider className="flex-1" />
          </div>

          <div className="flex flex-col gap-2">
            <Button className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-offset-1" startContent={<Icon icon="ri:apple-fill" className="text-default-500  " width={20} />} variant="bordered" onPress={signInWithApple}>
              Kontynuuj przez Apple
            </Button>

            <Button startContent={<Icon icon="flat-color-icons:google" width={20} />} variant="bordered" className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ">
              Kontynuuj przez Google
            </Button>
          </div>

          <p className="text-center text-xs md:text-small mt-4">
            {mode === "signup" ? "Masz już konto? " : "Nie masz jeszcze konta? "}
            <HeroUILink as={Link} to={mode === "signup" ? "/logowanie" : "/rejestracja"} size="sm" className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-offset-1">
              {mode === "signup" ? "Zaloguj się" : "Zajerestruj się"}
            </HeroUILink>
          </p>
        </div>
      </div>
      {mode === "signup" && (
        <Card isFooterBlurred className="flex-1 lg:flex-2 relative hidden md:flex max-h-[35.75rem]">
          <Image removeWrapper className="object-top  z-0 max-w-4xl w-full h-full object-cover" alt="Relaxed princess in the field with cats" src="/auth-bg-landscape.png" />
          <CardFooter className="h-[100px] absolute bg-black/40 bottom-0 z-10 rounded-lg w-[95%] m-4 px-4 flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <div className="bg-default-200/50 shadow-xl backdrop-blur-xl backdrop-saturate-200 p-2 rounded-lg">
                <Icon icon="mdi:book" className="text-white text-2xl  w-10 h-11" />
              </div>
              <div className="flex flex-col">
                <p className="text-tiny uppercase text-white/60">Magiczne opowieści</p>
                <p className="text-sm lg:text-md text-white">Zanurz się w świecie bajek</p>
              </div>
            </div>

            <HeroUILink as={Link} to="/" className="md:text-tiny lg:text-sm" showAnchorIcon>
              Czytaj więcej
            </HeroUILink>
          </CardFooter>
        </Card>
      )}
    </main>
  );
}
