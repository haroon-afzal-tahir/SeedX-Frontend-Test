import { IoCheckmarkCircle } from "react-icons/io5";
import { IoCalendarClearOutline } from "react-icons/io5";
import { IoTimeOutline } from "react-icons/io5";
import { IoCarSportOutline } from "react-icons/io5";
import { IoTicketOutline } from "react-icons/io5";
import { IoInformationCircleOutline } from "react-icons/io5";

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

  const confirmationDetails = [
    {
      icon: <IoTicketOutline className="text-xl text-blue-500" />,
      label: 'Confirmation ID',
      value: appointmentData.confirmacion_id,
      className: 'font-mono text-blue-500 font-medium'
    },
    {
      icon: <IoCalendarClearOutline className="text-xl text-emerald-500" />,
      label: 'Date',
      value: appointmentData.fecha,
    },
    {
      icon: <IoTimeOutline className="text-xl text-purple-500" />,
      label: 'Time',
      value: appointmentData.hora,
    },
    {
      icon: <IoCarSportOutline className="text-xl text-amber-500" />,
      label: 'Model',
      value: appointmentData.modelo,
    },
    {
      icon: <IoInformationCircleOutline className="text-xl text-gray-500" />,
      label: 'Message',
      value: appointmentData.mensaje,
    }
  ];

  return (
    <div className="w-full bg-sidebar/50 hover:bg-sidebar/70 rounded-xl border border-border/60 
      transition-all duration-200 shadow-sm backdrop-blur-sm overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 p-6 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="bg-green-500/20 p-2 rounded-full">
            <IoCheckmarkCircle className="text-2xl text-green-500" />
          </div>
          <div>
            <h2 className="font-medium text-foreground/90">Appointment Confirmed</h2>
            <p className="text-xs text-foreground/60 mt-0.5">
              Your test drive appointment has been successfully scheduled
            </p>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6 space-y-5">
        {confirmationDetails.map(({ icon, label, value, className }) => (
          <div key={label}
            className="flex items-center gap-4 py-2 px-4 rounded-lg bg-background/50 
              hover:bg-background/80 transition-all duration-200">
            <div className="flex-shrink-0">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground/60 mb-1">{label}</p>
              <p className={`text-sm text-foreground/90 truncate ${className || ''}`}>
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Section */}
      <div className="px-6 py-4 bg-background/50 border-t border-border/60">
        <p className="text-xs text-center text-foreground/60">
          Please arrive 10 minutes before your scheduled appointment time
        </p>
      </div>
    </div>
  );
};
