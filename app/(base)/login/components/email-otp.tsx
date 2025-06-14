'use client'

import { App, Button, Input } from "antd";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useEffectOnce, useInterval } from "react-use";
import { VerifyOtpParams } from "@supabase/supabase-js";
import { number, string } from "yup";
import { useShallow } from "zustand/react/shallow";

import { createClient } from "@/services/supabase/client";
import { useAuthStore } from "@/stores/auth";

export default function EmailOtp() {
  const supabase = createClient();
  const { t } = useTranslation();
  const [sendOTPCountdown, setSendOTPCountdown] = useState(0);
  const [sendOTPLoading, setSendOTPLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const {
    sendOTPTime,
    setSendOTPTime,
    updateSession,
  } = useAuthStore(
    useShallow((state) => ({
      sendOTPTime: state.sendOTPTime,
      setSendOTPTime: state.setSendOTPTime,
      updateSession: state.updateSession,
    })),
  );
  const { message } = App.useApp();

  useEffectOnce(() => {
    checkSendOTPTimeLimit();
  });

  useInterval(
    () => {
      setSendOTPCountdown(sendOTPCountdown - 1);
    },
    sendOTPCountdown > 0 ? 1000 : null,
  );

  const checkSendOTPTimeLimit = () => {
    if (sendOTPTime) {
      dayjs.extend(isSameOrAfter);
      const now = Date();
      const timeline = dayjs(sendOTPTime).add(60, "second");
      if (timeline.isSameOrAfter(now)) {
        setSendOTPCountdown(timeline.diff(now, "second"));
      }
    }
  };

  const showError = (errorMessage: string) => {
    message.error({
      content: errorMessage,
      style: { marginTop: "6vh" },
    })
      .then();
  };

  const checkEmail = () => {
    if (email.length === 0) {
      showError(t('auth.emailEmpty'));
      return false;
    } else {
      const result = string().email().isValidSync(email);
      if (!result) {
        showError(t("auth.emailFormatError"));
        return false;
      }
    }

    return true;
  };

  const onEmailChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setEmail(e.target.value);
  };

  const onOtpChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setToken(e.target.value);
  };

  const sendOTPEmail = async () => {
    // e.preventDefault()
    if (!checkEmail()) {
      return;
    }

    setSendOTPLoading(true);
    const { error } = await supabase.auth
      .signInWithOtp({
        email,
      })
      .finally(() => {
        setSendOTPLoading(false);
      });
    if (error) {
      showError(error.message);
    } else {
      setSendOTPCountdown(60);
      setSendOTPTime();
    }
  };

  const verifyOtp = async () => {
    if (!checkEmail()) {
      return;
    }

    if (
      token.length == 0 ||
      number().integer().isValidSync(token) == undefined
    ) {
      showError(t("auth.OTPError"));
      return;
    }

    setLoginLoading(true);
    const verifyOpts: VerifyOtpParams = {
      email,
      token,
      type: "magiclink",
    };

    const {
      data: { session },
      error,
    } = await supabase.auth.verifyOtp(verifyOpts);
    if (error) {
      showError(error.message);
    } else {
      updateSession(session);
      message.success(t("auth.loginSuccess"));
      window.location.replace('/');
    }
    setLoginLoading(false);
  };

  return (
    <div className="mb-8">
      <Input
        key={"email"}
        className="mb-4"
        type="email"
        allowClear
        onClear={() => setEmail("")}
        placeholder={t("auth.email")}
        onChange={onEmailChange}
      />

      <div className="flex flex-row justify-between items-end mb-10 gap-2">
        <Input
          key={"otp"}
          style={{ width: "70%" }}
          className="flex-none"
          allowClear
          placeholder={t("auth.OTP")}
          onChange={onOtpChange}
        />
        <Button
          style={{ width: "28%" }}
          className="ml-2 self-center"
          type="primary"
          loading={sendOTPLoading}
          disabled={sendOTPCountdown > 0}
          onClick={sendOTPEmail}
        >
          {sendOTPCountdown > 0
            ? t("auth.resendOTP", { count: sendOTPCountdown })
            : t("auth.sendOTP")}
        </Button>
      </div>

      <Button
        className="w-full"
        type="primary"
        loading={loginLoading}
        disabled={sendOTPLoading}
        onClick={verifyOtp}
      >
        {t("auth.login")}
      </Button>
    </div>
  );
}
