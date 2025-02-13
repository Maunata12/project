import Navbar from "./components/Navbar";
import MainPage from "./components/Mainpage";
import Feature from "./components/features";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />

      <MainPage />
      <Feature/>
      <Footer/>
    </div>
  );
}
