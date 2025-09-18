// components/LogoutButton.tsx
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  text: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ text }) => {

  const router = useRouter();

  const handleLogout = async () => {
    // Sign out the user and redirect to the login page
    await signOut({ redirect: false }); // don't redirect automatically
    router.push("/login"); // redirect to login page manually after signing out
  };

  return (

    <p onClick={handleLogout} className="">
      {text}
    </p>

  );
};

export default LogoutButton;
