import { el } from 'date-fns/locale';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ADMIN_ROLE } from '../../constants';
import { UserType } from '../../types/user';
import LoadingFullScreen from '../LoadingFullScreen';

type PrivateRouterProps = {
  children: JSX.Element;
  acceptRole?: number[];
};

const PrivateRouter = ({ acceptRole, children }: PrivateRouterProps) => {
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem("user") as string || "{}") as UserType;
    const isLogged = !!getUser._id

    if (!isLogged) {
      router.push("/signin");
      
    }else {
      // admin và acceptRole có quyền truy cập.
      const isAllow = getUser.role === ADMIN_ROLE || acceptRole?.includes(getUser.role);

      !isAllow ? router.push("/") : setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return loading ? <LoadingFullScreen /> : children;
}

export default PrivateRouter