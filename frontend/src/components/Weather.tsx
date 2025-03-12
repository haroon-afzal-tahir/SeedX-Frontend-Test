import { TiWeatherCloudy } from "react-icons/ti";

export const Weather = ({ output }: { output: string }) => {
  return (
    <div className="p-4 bg-background rounded-lg border border-border max-w-sm w-fit flex gap-2 items-center">
      <TiWeatherCloudy size={20} />
      <div className="text-sm text-foreground font-medium">
        {output.replace('\u00b0', '°')}
      </div>
    </div>
  );
};
