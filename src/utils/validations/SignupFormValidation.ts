export function validateSignupField(field: string, value: string, password?: string) {
    switch (field) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.length < 3) return "Name must be at least 3 characters";
        return "";
  
      case "email":
        { const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return "Email is required";
        if (!emailRegex.test(value)) return "Invalid email format";
        return ""; }
  
      case "mobile":
        { const phoneRegex = /^[0-9]{10}$/; 
        if (!value.trim()) return "Phone number is required";
        if (!phoneRegex.test(value)) return "Enter a valid 10-digit phone number";
        return ""; }
  
      case "password":
        { const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        if (!value.trim()) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters long";
        if (!passwordRegex.test(value)) return "Password must include a number and a special character";
        return ""; }
  
      case "cpassword":
        if (!value.trim()) return "Confirm password is required";
        if (value !== password) return "Passwords do not match";
        return "";
  
      default:
        return "";
    }
  }
  