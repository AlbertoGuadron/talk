import AdminPanel from "./AdminPanel";
import { TALKS } from "@/lib/talks-config";

export default function AdminPage() {
  const sheetId = process.env.GOOGLE_SPREADSHEET_ID;
  const isConfigured = !!(
    sheetId &&
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
    process.env.GOOGLE_PRIVATE_KEY
  );

  return (
    <AdminPanel
      talks={TALKS}
      sheetId={sheetId}
      isConfigured={isConfigured}
      revalidateToken={process.env.REVALIDATE_TOKEN || ""}
    />
  );
}
