import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
export default function Login() {
  return (
    <Button
      onClick={() => {
        signIn("google", { redirectTo: "/home" });
      }}
    >
      Login
    </Button>
  );
}
