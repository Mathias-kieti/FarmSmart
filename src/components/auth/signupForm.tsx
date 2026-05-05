import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COUNTIES } from "@/data/counties";
import { useUserStore } from "@/stores/userStore";

export default function SignupForm() {
  const navigate = useNavigate();
  const { signup, loading, error, clearError } = useUserStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [county, setCounty] = useState("Nyeri");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    clearError();

    try {
      await signup({ name, email, password, phone, county });
      navigate("/", { replace: true });
    } catch {
      // The store already saves the error message for the UI.
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Register your FarmSmart profile.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+2547..."
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>County</Label>
            <Select value={county} onValueChange={setCounty}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COUNTIES.map((countyName) => (
                  <SelectItem key={countyName} value={countyName}>
                    {countyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
