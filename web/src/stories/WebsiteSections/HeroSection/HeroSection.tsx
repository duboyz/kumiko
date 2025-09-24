import { HeroSectionType } from "@shared";

interface HeroSectionProps {
  heading: string;
  text: string;

  buttonText: string;
  buttonUrl: string;
  buttonTextColor: string;
  buttonBackgroundColor: string;

  imageUrl: string;

  // Overlay props
  overlayColor?: string;
  overlayOpacity?: number;

  type: HeroSectionType;
}

export const HeroSection = ({ heading, text, buttonText, buttonUrl, buttonTextColor, buttonBackgroundColor, type, imageUrl, overlayColor, overlayOpacity }: HeroSectionProps) => {

  const props = { heading, text, buttonText, buttonUrl, buttonTextColor, buttonBackgroundColor, imageUrl, overlayColor, overlayOpacity }

  if (type === HeroSectionType.BackgroundImage) return <HeroSectionBackgroundImage {...props} />
}

const HeroSectionBackgroundImage = ({ heading, text, buttonText, buttonUrl, buttonTextColor, buttonBackgroundColor, imageUrl, overlayColor = '#000000', overlayOpacity = 0.4 }: Omit<HeroSectionProps, 'type'>) => {

  const testImage = new Image();
  testImage.onload = () => console.log('Image loaded successfully:', imageUrl);
  testImage.onerror = () => console.error('Image failed to load:', imageUrl);
  testImage.src = imageUrl;

  const backgroundStyle = {
    backgroundImage: `url("${imageUrl}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#1f2937', // Fallback background color
  };

  const overlayStyle = {
    backgroundColor: overlayColor,
    opacity: overlayOpacity,
  };

  return (
    <section
      className="relative flex items-center justify-center"
      style={backgroundStyle}
    >
      {/* Customizable overlay for better text readability */}
      <div className="absolute inset-0" style={overlayStyle} />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          {heading}
        </h1>

        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          {text}
        </p>

        {buttonText && buttonUrl && (
          <a
            href={buttonUrl}
            className="inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{
              color: buttonTextColor,
              backgroundColor: buttonBackgroundColor,
            }}
          >
            {buttonText}
          </a>
        )}
      </div>
    </section>
  )
}
