export const AppointmentAvailability = ({ output }: { output: string }) => {
  // Parse the string to get the array of times
  const parseTimeSlots = (outputString: string) => {
    try {
      // Remove escape characters, extra quotes, markdown code block syntax, and convert single quotes to double quotes
      const cleanString = outputString
        .replace(/\\"/g, '"') // Remove escaped quotes
        .replace(/^"|"$/g, "") // Remove surrounding quotes
        .replace(/```/g, "") // Remove markdown code block syntax
        .replace(/'/g, '"'); // Convert single quotes to double quotes
      return JSON.parse(cleanString);
    } catch (error) {
      console.error("Error parsing time slots:", error);
      return [];
    }
  };

  const timeSlots = parseTimeSlots(output);

  return (
    <div className="p-6 bg-sidebar rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200 border-b pb-3">
        Available Appointment Times
      </h2>
      {timeSlots.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center py-4">
          No available time slots found
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {timeSlots.map((time: string) => (
            <div
              key={time}
              className="bg-white dark:bg-sidebar/90 border border-gray-200 dark:border-gray-700
                text-gray-800 dark:text-gray-300 py-3 px-4 rounded-lg text-center"
            >
              {time}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
