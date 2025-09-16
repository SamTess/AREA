import GithubLoginButton from "@/components/auth/GithubLoginButton";

const redirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI || (typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '/auth/callback');

export default function Auth() {

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <GithubLoginButton />
    </div>
  );
}
