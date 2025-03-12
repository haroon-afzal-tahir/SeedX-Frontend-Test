interface AppointmentConfirmationProps {
  output: string
}

export const AppointmentConfirmation = ({ output }: AppointmentConfirmationProps) => {
  // Parse the output string by removing the code block markers and converting to valid JSON
  const parseAppointmentData = (outputString: string) => {
    try {
      const cleanString = outputString
        .replace(/^"|"$/g, '')    // Remove surrounding quotes
        .replace(/```/g, '')      // Remove markdown code block syntax
        .replace(/'/g, '"');      // Convert single quotes to double quotes
      return JSON.parse(cleanString);
    } catch (error) {
      console.error('Error parsing appointment data:', error);
      return {};
    }
  };

  const appointmentData = parseAppointmentData(output);

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Appointment Confirmation</h2>
      <div className="space-y-4">
        <div className="flex items-center py-2 border-b border-gray-100">
          <span className="text-gray-600 font-medium w-1/3">Confirmation ID:</span>
          <span className="text-gray-800 flex-1">{appointmentData.confirmacion_id}</span>
        </div>
        <div className="flex items-center py-2 border-b border-gray-100">
          <span className="text-gray-600 font-medium w-1/3">Date:</span>
          <span className="text-gray-800 flex-1">{appointmentData.fecha}</span>
        </div>
        <div className="flex items-center py-2 border-b border-gray-100">
          <span className="text-gray-600 font-medium w-1/3">Time:</span>
          <span className="text-gray-800 flex-1">{appointmentData.hora}</span>
        </div>
        <div className="flex items-center py-2 border-b border-gray-100">
          <span className="text-gray-600 font-medium w-1/3">Model:</span>
          <span className="text-gray-800 flex-1">{appointmentData.modelo}</span>
        </div>
        <div className="flex items-center py-2">
          <span className="text-gray-600 font-medium w-1/3">Message:</span>
          <span className="text-gray-800 flex-1">{appointmentData.mensaje}</span>
        </div>
      </div>
    </div>
  );
};
