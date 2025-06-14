"use client"

import i18n from "i18next"
import { I18nextProvider, initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend'
import React, { useEffect, useState } from "react";

// 支持的语言列表
export const languages = ["zh", "en"] as const
export type Language = (typeof languages)[number]

// 默认语言
export const defaultLanguage: Language = "zh"

// 语言显示名称
export const languageNames: Record<Language, string> = {
  zh: "中文",
  en: "English",
}

async function initI8n() {
  // i18next 初始化配置
  return i18n
    // 使用语言检测器
    .use(LanguageDetector)
    .use(HttpBackend)
    // 初始化 react-i18next
    .use(initReactI18next)
    .init<HttpBackendOptions>({
      // 调试模式（开发环境）
      debug: process.env.NODE_ENV === "development",

      // 默认语言
      lng: defaultLanguage,

      // 回退语言
      fallbackLng: defaultLanguage,

      // 支持的语言
      supportedLngs: languages,

      // 默认命名空间
      // defaultNS: "common",

      // 命名空间
      // ns: ["common", "home", "about", "contact"],

      // 语言检测配置
      detection: {
        // 检测顺序
        order: ["localStorage", "navigator", "htmlTag"],

        // 缓存用户语言选择
        caches: ["localStorage"],

        // localStorage 键名
        lookupLocalStorage: "i18nextLng",
      },

      // 插值配置
      interpolation: {
        // React 已经安全处理了 XSS
        escapeValue: false,
      },

      // 资源配置
      // resources: {
      // },

      // 加载路径配置
      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
        queryStringParams: { v: '1.3.5' },
      },

      // React 特定配置
      // react: {
      //   // 使用 Suspense 进行异步加载
      //   useSuspense: true,
      // },
    })
}

export interface I18nProviderProps {
  children: React.ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // 等待 i18n 初始化完成
    i18n.on("initialized", () => {
      setIsInitialized(true);
    })

    // 如果已经初始化，直接设置状态
    if (i18n.isInitialized) {
      setIsInitialized(true)
    } else {
      initI8n().then()
    }

    return () => {
      i18n.off("initialized")
    }
  }, [])

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
