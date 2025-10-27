
import { adminUsers } from "@/lib/data";

// This function generates the static paths for each user at build time.
// It's placed in a layout file to avoid conflicts with "use client" in the page file.
export async function generateStaticParams() {
  // We need to provide a list of all possible userIds so Next.js can pre-render them.
  // In a real app, you might fetch this from a database.
  // We will use the initial list of users for this.
  return adminUsers.map((user) => ({
    userId: user.id,
  }));
}

export default function UserDetailsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
