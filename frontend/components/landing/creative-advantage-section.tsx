import Image from "next/image"
import Link from "next/link"

const creativityImages = [
  {
    src: "/images/landing/creativity-2.jpg",
    title: "Product energy",
  },
  {
    src: "/images/landing/creativity-3.jpg",
    title: "Campaign culture",
  },
  {
    src: "/images/landing/creativity-4.jpg",
    title: "Visual direction",
  },
  {
    src: "/images/landing/creativity-5.jpg",
    title: "Ready to post",
  },
]

export function CreativeAdvantageSection() {
  return (
    <section className="creative-section">
      <div className="creative-bg-glow" />

      <div className="creative-container">
        <div className="creative-copy">
          <p className="creative-kicker">DHOOM CREATIVE ENGINE</p>

          <h2>
            Your unfair
            <br />
            creative advantage.
          </h2>

          <div className="creative-punch-lines">
            <span>Out-think.</span>
            <span>Out-create.</span>
            <span>Out-market.</span>
          </div>

          <p className="creative-description">
            Dhoom gives small Pakistani sellers the campaign brain they never
            had — sharper ideas, stronger visuals, better posting direction,
            and ready-to-use marketing output.
          </p>

          <p className="creative-roman">
            Product wahi. Soch nayi. Campaign Dhoom wali.
          </p>

          <Link href="/request-access" className="creative-cta">
            Start Dhoom
          </Link>
        </div>

        <div className="creative-gallery">
          {creativityImages.map((image, index) => (
            <div
              key={image.src}
              className={`creative-image-card creative-image-card-${index + 1}`}
            >
              <Image
                src={image.src}
                alt={image.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80vw, 24vw"
              />

              <div className="creative-image-overlay" />

              <div className="creative-image-label">
                <span>0{index + 1}</span>
                <p>{image.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
