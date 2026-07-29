import WelcomeRedirect from "./WelcomeRedirect";

export const metadata = {
  title: "Welcome | GodotAwesome",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://godotawesome.com/about/" },
};

/** Legacy /welcome/ → About */
export default function WelcomePage() {
  return <WelcomeRedirect />;
}
