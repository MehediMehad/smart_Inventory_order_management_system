import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
      <p className="mt-4 text-lg">
        Oops! The page you are looking for doesn't exist.
      </p>
      <Button className="mt-6" asChild>
        <Link href="/" className="px-4 py-2 bg-primary text-white rounded-md">
          Go to Home
        </Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
