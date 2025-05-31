const ActivityLog = () => {
  return (
    <table className="w-full rounded-xl border border-gray-200 border-separate border-spacing-0 overflow-hidden">
      <thead className="bg-gray-200">
        <tr className="grid grid-cols-6 p-3 text-left">
          <th className="flex gap-4 items-center">
            <input type="checkbox" name="selectguests" id="selectguests" />
            <span>id</span>
          </th>
          <th>name</th>
          <th>status</th>
          <th>checked-in time</th>
          <th>checked-out time</th>
          <th>method</th>
        </tr>
      </thead>
      <tbody>
        <tr className="grid grid-cols-6 items-center p-3 text-left">
          <td className="flex gap-4 items-center">
            <input type="checkbox" name="selectguests" id="selectguests" />
            <span>1</span>
          </td>
          <td>Eghosa</td>
          <td className="flex items-center gap-4">
            <span className="bg-green-100 text-green-400 text-sm p-2 rounded-lg font-poppins-medium">
              checked-in
            </span>
          </td>
          <td>
            <span className="text-green-400 text-sm font-poppins-medium">
              12:30 AM
            </span>
          </td>
          <td>
            <span className="text-amber-400 text-sm p-2 rounded-md font-poppins-medium">
              12:30 AM
            </span>
          </td>
          <td>qrcode</td>
        </tr>
      </tbody>
    </table>
  );
};

export default ActivityLog;
