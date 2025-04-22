export function ValidateProfileFields(field: string, value: string) {
  switch (field) {
    case "name":
      if (!value.trim()) return "Name is required";
      if (value.length < 3) return "Name must be at least 3 characters";
      return "";

    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) return "Email is required";
      if (!emailRegex.test(value)) return "Invalid email format";
      return "";

    case "mobile":
      const phoneRegex = /^[0-9]{10}$/;
      if (!value.trim()) return "Phone number is required";
      if (!phoneRegex.test(value)) return "Enter a valid 10-digit phone number";
      return "";

    case "password":
      const passwordRegex =
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
      if (!value.trim()) return "Password is required";
      if (value.length < 8)
        return "Password must be at least 8 characters long";
      if (!passwordRegex.test(value))
        return "Password must include a number and a special character";
      return "";

    case "dob":
      if (!value.trim()) return "";
      const selectedDate = new Date(value);
      const today = new Date();

      if (selectedDate > today) return "Date of birth cannot be in the future";

      const ageDiff = today.getFullYear() - selectedDate.getFullYear();
      const hasBirthdayPassed =
        today.getMonth() > selectedDate.getMonth() ||
        (today.getMonth() === selectedDate.getMonth() &&
          today.getDate() >= selectedDate.getDate());

      const age = hasBirthdayPassed ? ageDiff : ageDiff - 1;

      if (age < 18) return "You must be at least 18 years old";

      return "";

    default:
      return "";
  }
}


export function validateAddressFields(field: string, value: string): string {
  switch (field) {
    case "state":
      if (!value.trim()) return "State is required.";
      if (!/^[a-zA-Z\s]+$/.test(value))
        return "State must contain only letters.";
      return "";

    case "city":
      if (!value.trim()) return "City is required.";
      if (!/^[a-zA-Z\s]+$/.test(value))
        return "City must contain only letters.";
      return "";



    case "pincode":
      if (!value.trim()) return "Pincode is required.";
      if (!/^\d{6}$/.test(value)) return "Pincode must be a 6-digit number.";
      return "";

    default:
      return "";
  }
}
