export const DealershipAddress = ({ output }: { output: string }) => {
  return (
    <div className="text-gray-700 dark:text-blue-300 text-sm py-2 px-4 rounded-md bg-sidebar border border-gray-200 dark:border-blue-300">
      {output}
    </div>
  );
};
