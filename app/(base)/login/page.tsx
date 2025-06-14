"use client"

import { Button, Divider } from "antd";
import { useRouter } from "next/navigation";
import { HorizontalCenter, VerticalCenter, VerticalLayout } from "jifou-react-ui";
import { useTranslation } from "react-i18next";

import LogoIcon from "@/icons/logo.svg";
import CloseIcon from "@/icons/close.svg";

import EmailOtp from "./components/email-otp";
import OAuthIcons from "./components/oauth";

export default function Page() {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <VerticalLayout className="size-full">
      <Button
        className="!py-4 self-end mt-5 mr-5"
        icon={<CloseIcon />}
        onClick={() => router.back()}
      />

      <VerticalCenter className="h-full mb-40">
        <HorizontalCenter className="mb-10">
          <LogoIcon />
          <div className="text-center ml-4 text-4xl font-bold">
            {t("app.name")}
          </div>
        </HorizontalCenter>

        <EmailOtp />

        <VerticalCenter className="w-1/5">
          <Divider style={{ marginTop: "0px" }}>
            <span className="text-xs text-gray-300">{t("auth.moreAuth")}</span>
          </Divider>
        </VerticalCenter>

        <OAuthIcons />
      </VerticalCenter>

    </VerticalLayout>
  )

}