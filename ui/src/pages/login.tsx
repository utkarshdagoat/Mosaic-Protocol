import styles from "./pages.module.css";
import logo from "../assets/logo.svg";
import LoginCard from "@/components/login-card";

export default function Login() {
  return (
    <>
      <div className={`${styles.checkerboard_bg}`}>
        <div className="h-screen w-full bg-white/40 flex items-center justify-center">
          <div className="flex flex-col gap-4">
            <img src={logo} width={160} />
            <LoginCard />
          </div>
        </div>
      </div>
    </>
  );
}
