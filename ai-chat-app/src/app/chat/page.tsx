import { UserButton } from "@clerk/nextjs";

export default function ChatPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">
           You are logged in!
        </h1>
        <UserButton />
      </div>
    </div>
  );
}