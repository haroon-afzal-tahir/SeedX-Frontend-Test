export const Weather = ({ output }: { output: string }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-sm mx-auto">
      <div className="text-lg text-gray-800 font-medium">
        {output.replace('\u00b0', '°')}
      </div>
    </div>
  );
};
