export const AppointmentAvailability = ({ output }: { output: string[] }) => {
  // Parse the string to get the array of times
  const parseTimeSlots = (outputString: string) => {
    try {
      // Remove the markdown code block syntax and parse the array
      const cleanString = outputString.replace(/```/g, '');
      return JSON.parse(cleanString);
    } catch (error) {
      console.error('Error parsing time slots:', error);
      return [];
    }
  };

  const timeSlots = parseTimeSlots(output[0]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">
        Available Appointment Times
      </h2>
      {timeSlots.length === 0 ? (
        <p className="text-gray-600 text-center py-4">
          No available time slots found
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {timeSlots.map((time: string) => (
            <button
              key={time}
              className="transition-all duration-200 bg-white border-2 border-blue-500 hover:bg-blue-50 
                text-blue-600 font-medium py-3 px-4 rounded-lg shadow-sm hover:shadow-md 
                active:transform active:scale-95"
            >
              {time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
