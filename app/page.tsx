import Header from "@/components/header"
import Hero from "@/components/hero"
import Features from "@/components/features"
import UploadCard from "@/components/upload-card"
import VerificationCard from "@/components/verification-card"
import Footer from "@/components/footer"
import CameraCapture from "@/components/CameraCapture"
import ClickSpark from '@/components/ClickSpark';
import VerificationFlow from "@/components/VerificationFlow"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="z-100">
  <ClickSpark
    sparkColor="#fff"
    sparkSize={10}
    sparkRadius={15}
    sparkCount={8}
    duration={400}
  >
  

      <Header />
      <Hero />
      <Features />
      {/* Upload Evidence Section */}
      <section id="upload" className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Upload Evidence</h2>
            <p className="text-muted-foreground">Hash your files instantly and prepare for blockchain anchoring</p>
          </div>
          <UploadCard />
        </div>
      </section>

      <section id="verify" className="py-12 md:py-16 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Verify Evidence</h2>
            <p className="text-muted-foreground">Reupload files to verify their integrity and blockchain status</p>
          </div>
          <VerificationCard />
        </div>
        
      </section>
      <VerificationFlow/>

      <Footer />
      </ClickSpark>
</div>
    </main>
  )
}
