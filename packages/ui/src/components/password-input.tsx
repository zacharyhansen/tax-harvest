"use client";

import type { InputProps } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";

import { Input } from "@repo/ui/components/input";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "../utils";

const PasswordInput = ({
  ref,
  className,
  ...props
}: InputProps & { ref?: React.RefObject<HTMLInputElement | null> }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("hide-password-toggle w-full pr-10", className)}
        ref={ref}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="pointer-events-auto absolute right-0 top-0 z-10 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => {
          setShowPassword((previous) => !previous);
        }}
        disabled={props.disabled}
      >
        {showPassword && !props.disabled ? (
          <Eye className="size-4" aria-hidden="true" />
        ) : (
          <EyeOff className="size-4" aria-hidden="true" />
        )}
        <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span>
      </Button>
      {/* hides browsers password toggles */}
      <style>
        {` .hide-password-toggle::-ms-reveal, .hide-password-toggle::-ms-clear {
visibility: hidden;
pointer-events: none;
display: none;
}
`}
      </style>
    </div>
  );
};

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
