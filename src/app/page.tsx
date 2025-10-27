import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <nav>
        <ul>
          <li>
            <Link href="/auth/register">Register</Link>
          </li>
          <li>
            <Link href="/auth/login">Login</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
