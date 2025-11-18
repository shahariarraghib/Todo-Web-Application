import { ProtectedRoute } from "@/components/ProtectedRoute";
import ChangePasswordPage from "@/components/ChangePasswordPage";

export default function ChangePassword() {
  return (
    <ProtectedRoute>
      <ChangePasswordPage />
    </ProtectedRoute>
  );
}

