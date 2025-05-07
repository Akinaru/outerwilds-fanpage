import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Change cette logique selon ce que tu considères comme "mobile"
const isMobile = () => window.innerWidth < 1024;

const WRONG_ROUTE = '/wrong-device';

export const useDeviceRedirect = (allowedRoutes: string[]) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAndRedirect = () => {
            const onMobile = isMobile();
            const isOnWrongDeviceRoute = location.pathname === WRONG_ROUTE;
            const isAllowed = allowedRoutes.some((route) => location.pathname.startsWith(route));

            if (onMobile && !isOnWrongDeviceRoute && isAllowed) {
                navigate(WRONG_ROUTE, { replace: true });
            }

            if (!onMobile && isOnWrongDeviceRoute) {
                navigate('/', { replace: true });
            }
        };

        checkAndRedirect();

        window.addEventListener('resize', checkAndRedirect);
        return () => window.removeEventListener('resize', checkAndRedirect);
    }, [location.pathname, navigate, allowedRoutes]);
};