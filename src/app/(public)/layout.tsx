import "@/src/styles/normalize.css";
import "@/src/styles/globals.scss";
import "@/src/styles/variables.css";

import { Roboto_Flex } from "next/font/google";
import { getSupaUser } from "../../lib/utils/getSupaUser";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Beatdown",
  description:
    "A social media inspired Boxing focused workout application, designed to help beginners and experienced users alike improve their skillset by leveraging Beatdown's' unique feature set, such as random combo generation.",
};

const RobotoFlex = Roboto_Flex({
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSupaUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <html lang="en" className={RobotoFlex.className}>
      <body>
        <div className="app-wrapper">
          <main className="main-no-user">{children}</main>
        </div>
      </body>
    </html>
  );
}