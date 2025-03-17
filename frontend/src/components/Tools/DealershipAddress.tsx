export const DealershipAddress = ({ output }: { output: string }) => {
  return (
    <div className="text-foreground text-sm py-2 px-4 rounded-md bg-background border border-border">
      {output}
    </div>
  );
};
