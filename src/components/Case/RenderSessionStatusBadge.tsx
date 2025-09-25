export const renderStatusBadge = (status: string) => {
  const statusConfig: Record<
    string,
    { label: string; className: string }
  > = {
    upcoming: {
      label: "Upcoming",
      className:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    ongoing: {
      label: "Ongoing",
      className:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    completed: {
      label: "Completed",
      className:
        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
    missed: {
      label: "Missed",
      className:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    },
  };

  const config = statusConfig[status] || statusConfig.upcoming;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
};
