import { GithubOAuth, GitlabOAuth, MicroSoftOAuth } from "./third-oauth";

export default function OAuthIcons() {
  return (
    <div className="flex-row-center">
      <MicroSoftOAuth />
      <GithubOAuth />
      <GitlabOAuth />
    </div>
  );
}
