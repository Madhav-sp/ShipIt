function StatusBadge({ status }) {

  const styles = {
    SUCCESS:
      "bg-green-900 text-green-300",

    BUILDING:
      "bg-yellow-900 text-yellow-300",

    FAILED:
      "bg-red-900 text-red-300",

    QUEUED:
      "bg-blue-900 text-blue-300",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-sm ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;