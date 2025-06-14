import { Button } from "antd";
import { useRouter } from "next/navigation";
import { HorizontalCenter } from "jifou-react-ui";

export interface UnAuthButtonProps {
  authPath: string;
}

export default function UnAuthButton({
  authPath,
}: UnAuthButtonProps) {
  const router = useRouter();

  return (
    <HorizontalCenter>
      <Button
        type="link"
        style={{ padding: "0px" }}
        onClick={() => router.push(authPath)}
      >
        登录
      </Button>
      <div>后，可与你的助理对话</div>
    </HorizontalCenter>
  );
}
