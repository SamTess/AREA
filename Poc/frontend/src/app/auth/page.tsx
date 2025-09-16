import GithubLoginButton from "@/components/auth/GithubLoginButton";

export default function Auth() {

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <GithubLoginButton />
    </div>
  );
}
