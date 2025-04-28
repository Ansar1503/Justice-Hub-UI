export default function VerificationInputs(field: string, value: any) {
  switch (field) {
    case "description": {
      if (!value.trim()) return "Description is required";
      if (value.length < 10) return "Description must be at least 10 characters long";
      if (value.length > 500) return "Description must not exceed 500 characters";
      return "";
    }

    case "bar_council_number": {
      if (!value.trim()) return "Bar council number is required";
      if (value.length < 5) return "Bar council number must be at least 5 characters long";
      if (value.length > 20) return "Bar council number must not exceed 20 characters";
      return "";
    }

    case "barcouncilid": {
      if (!value) return "Bar council ID document is required";
      
      // Check file type for barcouncilid
      if (value instanceof File) {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(value.type)) {
          return "Only PDF or image files (JPEG, PNG) are allowed";
        }
        // Check file size (max 5MB)
        if (value.size > 5 * 1024 * 1024) {
          return "File size should not exceed 5MB";
        }
      }
      return "";
    }

    case "enrollment_certificate_number": {
      if (!value.trim()) return "Enrollment certificate number is required";
      if (value.length < 5) return "Enrollment certificate number must be at least 5 characters long";
      if (value.length > 20) return "Enrollment certificate number must not exceed 20 characters";
      return "";
    }

    case "enrollment_certificate": {
      if (!value) return "Enrollment certificate document is required";
      
      // Check file type for enrollment certificate
      if (value instanceof File) {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(value.type)) {
          return "Only PDF or image files (JPEG, PNG) are allowed";
        }
        // Check file size (max 5MB)
        if (value.size > 5 * 1024 * 1024) {
          return "File size should not exceed 5MB";
        }
      }
      return "";
    }

    case "certificate_of_practice_number": {
      if (!value.trim()) return "Certificate of practice number is required";
      if (value.length < 5) return "Certificate of practice number must be at least 5 characters long";
      if (value.length > 20) return "Certificate of practice number must not exceed 20 characters";
      return "";
    }

    case "certificate_of_practice": {
      if (!value) return "Certificate of practice document is required";
      
      // Check file type for certificate of practice
      if (value instanceof File) {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(value.type)) {
          return "Only PDF or image files (JPEG, PNG) are allowed";
        }
        // Check file size (max 5MB)
        if (value.size > 5 * 1024 * 1024) {
          return "File size should not exceed 5MB";
        }
      }
      return "";
    }

    case "practice_areas": {
      if (!Array.isArray(value) || value.length === 0) return "At least one practice area must be selected";
      return "";
    }

    case "specialisation": {
      if (!Array.isArray(value) || value.length === 0) return "At least one specialisation must be selected";
      return "";
    }

    case "experience": {
      if (value === null || value === undefined) return "Experience is required";
      if (isNaN(Number(value))) return "Experience must be a number";
      if (Number(value) < 0) return "Experience cannot be negative";
      if (Number(value) > 60) return "Experience seems too high, please verify";
      return "";
    }

    case "consultation_fee": {
      if (value === null || value === undefined) return "Consultation fee is required";
      if (isNaN(Number(value))) return "Consultation fee must be a number";
      if (Number(value) < 0) return "Consultation fee cannot be negative";
      if (Number(value) > 50000) return "Consultation fee seems too high, please verify";
      return "";
    }

    default: {
      return "";
    }
  }
}