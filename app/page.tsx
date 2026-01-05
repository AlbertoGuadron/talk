import Header from "@/components/header"
import Footer from "@/components/footer"
import Homepage from "@/components/home"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header/>
      <main>
        <Homepage/>
      </main>
      <Footer/>
    </div>
  )
}