import { useState } from "react";

const Room = () => {
  const [data, setData] = useState({ name: "", room: "" });
  console.log(data);
  return (
    <div>
      <h3>jion room</h3>
      <div>
        <input
          type="text"
          placeholder="name"
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
        <input
          type="text"
          placeholder=" room "
          onChange={(e) => setData({ ...data, room: e.target.value })}
        />
        <button>jion room</button>
      </div>
    </div>
  );
};

export default Room;
