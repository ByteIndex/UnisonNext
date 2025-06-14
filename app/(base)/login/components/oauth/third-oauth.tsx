import OAuthIcon from "./base-oauth";

export function GithubOAuth() {
  return (
    <OAuthIcon
      provider="github"
      name="GitHub"
      iconSrc="https://cdn.jsdelivr.net/gh/Deep-Heart/picx-images-hosting@master/chat/github.5kaxgvzgf580.svg"
      size={36}
    />
  );
}

export function GitlabOAuth() {
  return (
    <OAuthIcon
      provider="gitlab"
      name="GitLab"
      iconSrc="https://cdn.jsdelivr.net/gh/Deep-Heart/picx-images-hosting@master/chat/gitlab.6oxbey3pzjk0.svg"
      size={36}
    />
  );
}

export function MicroSoftOAuth() {
  return (
    <OAuthIcon
      provider="azure"
      name="MicroSoft"
      iconSrc="https://cdn.jsdelivr.net/gh/Deep-Heart/picx-images-hosting@master/chat/microsoft.2mlsdkwzqgs0.svg"
      size={36}
      shape="square"
      options={{
        scopes: "email offline_access",
      }}
    />
  );
}
