export function validateSigninField(field: string, value: string) {
  switch (field) {
    case "email": {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) return "Email is required";
      if (!emailRegex.test(value)) return "Invalid email format";
      return "";
    }

    case "password": {
      const passwordRegex =
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
      if (!value.trim()) return "Password is required";
      if (value.length < 8)
        return "Password must be at least 8 characters long";
      if (!passwordRegex.test(value))
        return "Password must include a number and a special character";
      return "";
    }

    default:
      return "";
  }
}
