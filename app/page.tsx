"use client";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/login");
  };
  return (
    <div className={styles.page}>
      <button onClick={handleClick}>Go To Login Page</button>
    </div>
  );
}
