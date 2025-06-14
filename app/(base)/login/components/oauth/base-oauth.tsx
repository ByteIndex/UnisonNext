import { App, Avatar, Button, Spin } from "antd";
import { useState } from "react";
import { Provider } from "@supabase/supabase-js";

import { createClient } from "@/services/supabase/client";

export default function OAuthIcon(props: {
  provider: Provider;
  name: string;
  iconSrc: string;
  size: number;
  shape?: "circle" | "square";
  options?: object;
}) {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  async function signInWithOAuth() {
    setLoading(true);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: props.provider,
      options: props.options,
    });

    if (error) {
      message.error({
        content: error.message,
        style: { marginTop: "6vh" },
      });
    }
  }

  return (
    <>
      <Spin spinning={loading} percent="auto" fullscreen />
      <Button type="link" onClick={signInWithOAuth}>
        <Avatar
          alt={props.name}
          size={props.size}
          src={props.iconSrc}
          shape={props.shape}
          draggable={false}
        />
      </Button>
    </>
  );
}
