import React, {useEffect} from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const withProtectedRoute = (WrappedComponent, allowedRoles = []) => {
  return (props) => {
    const router = useRouter();

    const checkUserRole = async () => {
      const session = await getSession();
      if (!session || !session.user || !session.user.roles) {
        router.push("/signin");
        return;
      }
      const userRoles = session.user.roles;
      const hasAccess = allowedRoles.some((role) => userRoles.includes(role));
      if (!hasAccess) {
        router.push("/unauthorized");
        return;
      }
    };

    useEffect(() => {
      checkUserRole();
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withProtectedRoute;
