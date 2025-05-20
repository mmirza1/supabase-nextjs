import AccountForm from "./account-form";
import { createClient } from "@/utils/supabase/server";

export default async function Account() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
        Account Settings
      </h2>
      <div className="space-y-6">
        <AccountForm user={user} />
      </div>
    </>
  );
}
