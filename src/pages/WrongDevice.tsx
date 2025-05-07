// pages/WrongDevice.tsx

import {useTranslation} from "react-i18next";


const WrongDevice = () => {
    const { t } = useTranslation();
    return (
        <div className="text-white min-h-screen flex items-center justify-center bg-black">
            <p className="text-xl px-4 text-center">
                {t('wrongdevice.text')}
            </p>
        </div>
    );
}

export default WrongDevice;