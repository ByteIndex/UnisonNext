'use client'

import React from 'react';
import { useTranslation } from "react-i18next";

export interface AppHeroProps {
}

export default function AppHero({}: AppHeroProps) {
  const { t } = useTranslation()

  return (
    <div className={"text-2xl font-bold"}>
      {t('app.name')}

      <div className={"text-lg mt-4"}>
        {t('app.description')}
      </div>
    </div>
  );
};