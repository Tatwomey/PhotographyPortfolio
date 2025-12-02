// utils/withAuth.js
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = (WrappedComponent) => {
  const WithAuthComponent = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      console.log(
        "[withAuth] status:",
        status,
        "| pathname:",
        router.pathname,
        "| session.user:",
        session?.user
      );

      if (status === "loading") return;

      if (!session?.user && router.pathname !== "/login") {
        console.log("[withAuth] redirect → /login");
        router.replace("/login");
      } else {
        console.log("[withAuth] no redirect from withAuth");
      }
    }, [status, session, router.pathname]);

    if (status === "loading") {
      return (
        <div className="text-center py-20 text-white">
          Checking authentication...
        </div>
      );
    }

    if (!session?.user) {
      // Redirect will happen via useEffect
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth;
