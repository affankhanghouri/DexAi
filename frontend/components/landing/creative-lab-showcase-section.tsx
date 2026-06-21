const imageFiles = [
  "image-1.jpg",
  "image-2.jpg",
  
  "ready_image_1.jpg",
  "image-5.png",
  "ready_image_3.jpg",
  "image-9.jpg",
  "image-8.jpg",
  "ready_image_2.jpg"
]

const videoFiles = [
  "ready_video_1.mp4",
    "ready_video_6.mp4",

  "ready_video_4.mp4",
  "WM_video-5.mp4",
  "WM_video-6.mp4",
  "ready_video_5.mp4"
]

const bucketBaseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/landing-assets`

function imageUrl(file: string) {
  return `${bucketBaseUrl}/creative-images/${file}`
}

function videoUrl(file: string) {
  return `${bucketBaseUrl}/creative-videos/${file}`
}

export function CreativeLabShowcaseSection() {
  const repeatedImages = [...imageFiles, ...imageFiles]
  const repeatedVideos = [...videoFiles, ...videoFiles]

  return (
    <section className="dhoom-reveal relative overflow-hidden bg-[#050611] py-16 text-white md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(212,175,55,0.18),transparent_30%),radial-gradient(circle_at_88%_18%,rgba(236,72,153,0.22),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(20,184,166,0.2),transparent_38%),linear-gradient(135deg,#050611,#170623_48%,#061421)]" />

      <div className="showcase-dots absolute inset-0 opacity-20" />
      <div className="showcase-sweep absolute left-[-45%] top-[-40%] h-[180%] w-[42%] rotate-12 bg-gradient-to-r from-transparent via-white/16 to-transparent blur-3xl" />

      <div className="relative z-10 mb-12 px-5 text-center">
        <p className="mx-auto mb-4 w-fit rounded-full border border-[#d4af37]/50 bg-white/5 px-4 py-2 text-[0.64rem] font-black uppercase tracking-[0.28em] text-[#d4af37]">
          Creative Proof
        </p>

        <h2 className="dhoom-luxe-heading mx-auto max-w-[880px] text-[clamp(2.8rem,5.2vw,5.6rem)]">
          Posters and <span>ads</span>
          <br />
          made to stop the scroll.
        </h2>

        <p className="mx-auto mt-5 max-w-[620px] text-sm font-bold leading-7 text-white/60 md:text-base">
          DEX AI turns product photos into campaign posters, launch creatives,
          and video ads that feel ready for social, search, and ecommerce.
        </p>
      </div>

      {/* POSTER ROW */}
      <div className="relative z-10">
        <div className="mb-5 flex items-center justify-between px-5 md:px-10 lg:px-16">
          <h3 className="dhoom-card-title text-2xl md:text-4xl">
            Campaign posters DEX AI can make
          </h3>

          <span className="rounded-full bg-[#d9ff3f] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#070816]">
            Image output
          </span>
        </div>

        <div className="showcase-marquee">
          <div className="showcase-marquee-track">
            {repeatedImages.map((file, index) => (
              <PosterCreativeCard
                key={`${file}-${index}`}
                src={imageUrl(file)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* VIDEO ROW */}
      <div className="relative z-10 mt-16 md:mt-20">
        <div className="mb-5 flex items-center justify-between px-5 md:px-10 lg:px-16">
          <h3 className="dhoom-card-title text-2xl md:text-4xl">
            Campaign ads that look unreal
          </h3>

          <span className="rounded-full bg-[#d4af37] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#070816]">
            Video output
          </span>
        </div>

        <div className="showcase-marquee showcase-marquee-reverse">
          <div className="showcase-marquee-track">
            {repeatedVideos.map((file, index) => (
              <VideoCreativeCard key={`${file}-${index}`} src={videoUrl(file)} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .showcase-dots {
          background-image:
            radial-gradient(circle, rgba(255,255,255,0.18) 0 1px, transparent 1.5px),
            radial-gradient(circle, rgba(212,175,55,0.22) 0 1px, transparent 1.4px);
          background-size: 42px 42px, 78px 78px;
          background-position: 0 0, 24px 18px;
          mask-image: radial-gradient(circle at 50% 45%, black, transparent 74%);
        }

        .showcase-sweep {
          animation: showcaseSweep 7s ease-in-out infinite;
        }

        @keyframes showcaseSweep {
          0% {
            transform: translateX(-120%) rotate(12deg);
            opacity: 0;
          }

          35% {
            opacity: 0.45;
          }

          65%,
          100% {
            transform: translateX(430%) rotate(12deg);
            opacity: 0;
          }
        }

        .showcase-marquee {
          width: 100%;
          overflow: hidden;
          mask-image: linear-gradient(
            90deg,
            transparent,
            black 8%,
            black 92%,
            transparent
          );
        }

        .showcase-marquee-track {
          display: flex;
          width: max-content;
          gap: 1.1rem;
          padding: 0 1rem;
          animation: showcaseSlide 36s linear infinite;
        }

        .showcase-marquee-reverse .showcase-marquee-track {
          animation-direction: reverse;
          animation-duration: 38s;
        }

        .showcase-marquee:hover .showcase-marquee-track {
          animation-play-state: paused;
        }

        @keyframes showcaseSlide {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  )
}

function PosterCreativeCard({ src }: { src: string }) {
  return (
    <div className="group w-[260px] shrink-0 overflow-hidden rounded-[1.8rem] border border-white/15 bg-white/[0.06] p-2.5 shadow-[0_28px_85px_rgba(0,0,0,0.42)] backdrop-blur-xl md:w-[300px]">
      <div className="relative overflow-hidden rounded-[1.35rem] bg-black">
        <img
          src={src}
          alt="DEX AI campaign poster"
          className="h-[400px] w-full object-cover transition duration-700 group-hover:scale-105 md:h-[460px]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#070816]/42 via-transparent to-transparent" />

        <div className="absolute inset-x-4 bottom-4">
          <span className="mb-2 inline-flex rounded-full bg-[#d9ff3f] px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#070816]">
            Poster
          </span>

          <p className="text-lg font-black leading-none tracking-[-0.05em] text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
            Ready-to-post creative
          </p>
        </div>
      </div>
    </div>
  )
}

function VideoCreativeCard({ src }: { src: string }) {
  return (
    <div className="group w-[280px] shrink-0 overflow-hidden rounded-[1.8rem] border border-white/15 bg-white/[0.06] p-2.5 shadow-[0_28px_85px_rgba(0,0,0,0.42)] backdrop-blur-xl md:w-[320px]">
      <div className="relative overflow-hidden rounded-[1.35rem] bg-black">
        <video
          src={src}
          className="h-[500px] w-full object-cover transition duration-700 group-hover:scale-105"
          autoPlay
          muted
          loop
          playsInline
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#070816]/45 via-transparent to-transparent" />

        <span className="absolute left-4 top-4 rounded-full bg-[#d4af37] px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.18em] text-[#070816]">
          AI generated
        </span>
      </div>
    </div>
  )
}
