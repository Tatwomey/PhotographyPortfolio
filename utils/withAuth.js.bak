import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = (WrappedComponent, allowedPages) => {
  return (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "unauthenticated") {
        router.replace("/login");
      } else if (session?.user && !allowedPages.includes(router.pathname)) {
        router.replace("/unauthorized"); // ✅ Redirect if user is not allowed on this page
      }
    }, [status, session, router]);

    if (status === "loading") {
      return <div className="text-center py-20 text-white">Checking authentication...</div>;
    }

    return session ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;
