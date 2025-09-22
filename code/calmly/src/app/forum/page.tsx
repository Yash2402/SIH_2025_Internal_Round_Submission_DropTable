import Image from "next/image";
import Link from "next/link";
import { Forum, type Post } from "@/components/Forum/Forum"; // Import Post type

// 1. Create a dummy user object for display purposes
const dummyUser = {
  name: "Jane Doe",
  image: "/avatars/4.jpg", // Make sure you have an image at this path in your /public folder
};

export default function ForumPage() {
  // 2. All server-side authentication logic is removed.

  // In the future, we will fetch real posts here and pass them as a prop.
  const posts: Post[] = []; // Placeholder for now

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link className="text-xs" href="/">
                <Image className="mb-1" src="/icon.png" alt="Calmly Logo" width={32} height={32} />
                <span className="text-border-black text-shadow-2xs justify-center items-center">Calmly</span>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Peer Support Forum</h1>
                <p className="text-sm text-gray-600">A safe space to connect and share.</p>
              </div>
            </div>
            {/* 3. The profile icon now uses the dummy user data */}
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
              {dummyUser.image ? (
                <Image src={dummyUser.image} alt="Profile" width={40} height={40} className="rounded-full cursor-pointer" />
              ) : (
                <span className="text-white font-semibold text-sm">{dummyUser.name?.charAt(0) || "U"}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Forum initialPosts={posts} />
      </main>
    </div>
  );
}
