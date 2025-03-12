interface AppointmentConfirmationProps {
  output: {
    confirmacion_id: string;
    fecha: string;
    hora: string;
    modelo: string;
    mensaje: string;
  }
}

export const AppointmentConfirmation = ({ output }: AppointmentConfirmationProps) => {
  return <div>AppointmentConfirmation</div>;
}
