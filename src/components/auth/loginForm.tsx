import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/stores/userStore";

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useUserStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const from = location.state?.from?.pathname ?? "/";

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    clearError();

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      // The store already saves the error message for the UI.
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Access your FarmSmart account.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            No account?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
