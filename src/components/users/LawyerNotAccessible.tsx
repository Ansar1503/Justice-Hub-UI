import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export default function LawyerNotAccessible() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 py-8 text-center">
      <Alert className="w-full max-w-md shadow-md">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
          <div className="text-left sm:text-left">
            <AlertTitle className="text-lg font-semibold">
              Lawyer Not Accessible
            </AlertTitle>
            <AlertDescription className="mt-1 text-sm text-gray-600">
              The lawyer profile you are trying to access is currently
              unavailable. This may be due to verification issues or the profile
              being blocked. Please browse other available lawyers.
            </AlertDescription>
          </div>
        </div>
      </Alert>

      <img
        src="/src/assets/undraw_access-denied_krem.svg"
        alt="Access Denied Illustration"
        className="w-3/4 sm:w-1/3 h-auto"
      />
    </div>
  );
}
