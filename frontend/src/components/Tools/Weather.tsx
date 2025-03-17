import { WiDaySunny, WiCloudy, WiRain, WiSnow } from "react-icons/wi";
import { IoLocationOutline } from "react-icons/io5";

export const Weather = ({ output }: { output: string }) => {
  // Helper function to determine weather icon based on description
  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('sun') || desc.includes('clear')) {
      return <WiDaySunny className="text-4xl text-yellow-500" />;
    } else if (desc.includes('cloud')) {
      return <WiCloudy className="text-4xl text-gray-400" />;
    } else if (desc.includes('rain')) {
      return <WiRain className="text-4xl text-blue-400" />;
    } else if (desc.includes('snow')) {
      return <WiSnow className="text-4xl text-blue-200" />;
    }
    return <WiDaySunny className="text-4xl text-yellow-500" />;
  };

  // Parse weather data (assuming format: "Temperature: 75°F, Sunny in Miami, FL")
  const parseWeather = (data: string) => {
    const temp = data.match(/\d+°[FC]/)?.[0] || "";
    const description = data.replace(/Temperature: |\d+°[FC],\s*/, "");
    return { temp, description };
  };

  const { temp, description } = parseWeather(output.replace('\u00b0', '°'));

  return (
    <div className="w-full bg-sidebar/50 hover:bg-sidebar/70 rounded-xl border border-border/60 
      transition-all duration-200 shadow-sm backdrop-blur-sm overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-blue-500/10 p-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <IoLocationOutline className="text-lg text-blue-500" />
          <p className="text-sm text-foreground/90">Current Weather</p>
        </div>
      </div>

      {/* Weather Content */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="text-3xl font-semibold text-foreground/90">
              {temp}
            </div>
            <div className="text-sm text-foreground/60">
              {description}
            </div>
          </div>
          <div className="bg-background/50 p-3 rounded-full">
            {getWeatherIcon(description)}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="px-4 py-2 bg-background/50 border-t border-border/60">
        <p className="text-xs text-center text-foreground/60">
          Weather conditions may affect your test drive experience
        </p>
      </div>
    </div>
  );
};
