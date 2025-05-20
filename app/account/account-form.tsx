"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";

// ...

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name, username, website, avatar_url`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string | null;
    fullname: string | null;
    website: string | null;
    avatar_url: string | null;
  }) {
    try {
      setLoading(true);

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert("Profile updated!");
    } catch (error) {
      alert("Error updating the data!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          type="text"
          value={user?.email}
          disabled
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                   text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800
                   focus:outline-none cursor-not-allowed"
        />
      </div>

      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={fullname || ""}
          onChange={(e) => setFullname(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                   text-gray-900 dark:text-white bg-white dark:bg-gray-700
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                   text-gray-900 dark:text-white bg-white dark:bg-gray-700
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="website"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Website
        </label>
        <input
          id="website"
          type="url"
          value={website || ""}
          onChange={(e) => setWebsite(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                   text-gray-900 dark:text-white bg-white dark:bg-gray-700
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col space-y-3">
        <button
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() =>
            updateProfile({ fullname, username, website, avatar_url })
          }
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update Profile"}
        </button>

        <form action="/auth/signout" method="post">
          <button
            className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
